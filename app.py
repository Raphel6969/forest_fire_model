# Project: Forest Fire Detection - Simple Flask + HTML/CSS Frontend
# Files included below. Create these files exactly in a folder (e.g. C:\Users\ragha\OneDrive\Desktop\coding\se project) and follow the commands in README at the bottom.

# -------------------------
# File: app.py
# -------------------------
from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import traceback
import numpy as np
from PIL import Image
import io

# TensorFlow import inside try/except to show clear message if not installed
try:
    import tensorflow as tf
    from tensorflow import keras
    from tensorflow.keras.layers import DepthwiseConv2D, GlobalAveragePooling2D
except Exception as e:
    print("TensorFlow import error (did you install the virtualenv and packages?):", e)
    raise

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# ------------------ Compatibility wrappers ------------------
class DepthwiseConv2D_with_groups(DepthwiseConv2D):
    def __init__(self, *args, groups=None, **kwargs):
        super().__init__(*args, **kwargs)

class GAP_NoKeepDims(GlobalAveragePooling2D):
    def __init__(self, *args, keepdims=None, **kwargs):
        super().__init__(*args, **kwargs)

custom_objects = {
    'DepthwiseConv2D': DepthwiseConv2D_with_groups,
    'GlobalAveragePooling2D': GAP_NoKeepDims,
}

MODEL_FILENAME = 'model_wildfire.h5'  # place model in same folder as app.py
INPUT_SHAPE = (224, 224)

# Load model
if not os.path.exists(MODEL_FILENAME):
    print(f"Model file {MODEL_FILENAME} not found in {os.getcwd()}")
    # don't raise here so app can still run for frontend demo without model
    model = None
else:
    try:
        model = keras.models.load_model(MODEL_FILENAME, custom_objects=custom_objects, compile=False)
        print('Model loaded. Input shape:', getattr(model, 'input_shape', None))
    except Exception:
        print('Model load failed. See traceback:')
        traceback.print_exc()
        model = None

# ------- helpers -------

def preprocess_image_bytes(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize(INPUT_SHAPE)
    arr = np.array(img).astype('float32') / 255.0
    return np.expand_dims(arr, axis=0)

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/detect')
def detect():
    return render_template('predict.html')

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'success': False, 'error': 'Model not loaded on server. Place model_wildfire.h5 in project folder.'}), 500

    if 'file' not in request.files:
        return jsonify({'success': False, 'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No selected file'}), 400

    filename = file.filename
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(save_path)

    try:
        with open(save_path, 'rb') as f:
            image_bytes = f.read()
        x = preprocess_image_bytes(image_bytes)
        preds = model.predict(x)
        preds = np.array(preds)
        # handle binary or multiclass
        if preds.ndim == 1 or (preds.ndim == 2 and preds.shape[1] == 1):
            score = float(preds.ravel()[0])
            label = 'Fire Detected' if score <= 0.5 else 'No Fire'
            return jsonify({'success': True, 'label': label, 'score': score, 'image': save_path})
        else:
            idx = int(np.argmax(preds, axis=1)[0])
            score = float(np.max(preds))
            return jsonify({'success': True, 'label': f'class_{idx}', 'score': score, 'image': save_path})
    except Exception as e:
        traceback.print_exc()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/analysis/<filename>')
def analysis(filename):
    # Re-run prediction to get data for the graph (or we could pass it via query params, but this is safer for now)
    # In a real app, we might cache the result.
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(file_path):
        return "File not found", 404

    try:
        with open(file_path, 'rb') as f:
            image_bytes = f.read()
        x = preprocess_image_bytes(image_bytes)
        preds = model.predict(x)
        preds = np.array(preds)
        
        fire_prob = 0
        no_fire_prob = 0
        label = ""

        if preds.ndim == 1 or (preds.ndim == 2 and preds.shape[1] == 1):
            score = float(preds.ravel()[0])
            # Sigmoid output: 0 = Fire, 1 = No Fire (based on previous code logic: score <= 0.5 is Fire)
            # WAIT: The previous code said: label = 'Fire Detected' if score <= 0.5 else 'No Fire'
            # So closer to 0 is Fire, closer to 1 is No Fire.
            fire_prob = (1 - score) * 100
            no_fire_prob = score * 100
            label = 'Fire Detected' if score <= 0.5 else 'No Fire'
        else:
            # Softmax output
            # Assuming class 0 is Fire, class 1 is No Fire (need to verify, but let's assume based on binary logic)
            # Actually, usually 0 is first class. Let's stick to the binary logic seen above for safety.
            # If it hits this else block, it's multiclass.
            # Let's just use the max score for now as generic.
            # But for the graph we need specific probabilities.
            # Let's assume 2 classes for the graph if multiclass: Class 0 and Class 1.
            probs = preds[0]
            if len(probs) >= 2:
                fire_prob = probs[0] * 100 # Assumption
                no_fire_prob = probs[1] * 100 # Assumption
            else:
                fire_prob = probs[0] * 100
                no_fire_prob = 0
            
            idx = int(np.argmax(preds, axis=1)[0])
            label = f'class_{idx}'

        return render_template('analysis.html', 
                               filename=filename, 
                               fire_prob=round(fire_prob, 2), 
                               no_fire_prob=round(no_fire_prob, 2),
                               label=label)

    except Exception as e:
        traceback.print_exc()
        return f"Error analyzing image: {e}", 500

# static uploads route (Flask will serve from /static by default, but we include this for clarity)
@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    # debug True for development; set to False for production
    app.run(host='127.0.0.1', port=5000, debug=True)

