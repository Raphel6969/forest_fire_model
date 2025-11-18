# 🔥 Forest Fire Detection Model

A Deep Learning-powered web application for real-time forest fire detection from images. Built with Flask and TensorFlow, featuring a modern, fire-themed UI with smooth animations.

## ✨ Features

- **Real-Time Detection**: Upload an image and instantly detect the presence of forest fires
- **Modern UI**: Beautiful, responsive design with fire-themed animations
- **Easy to Use**: Simple drag-and-drop or click-to-upload interface
- **Powered by AI**: Uses a trained deep learning model for accurate predictions

## 📋 Prerequisites

- [Anaconda](https://www.anaconda.com/products/distribution) or [Miniconda](https://docs.conda.io/en/latest/miniconda.html) installed on your machine
- The trained model file `model_wildfire.h5` (see Model Setup below)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Raphel6969/forest_fire_model.git
cd forest_fire_model
```

### 2. Download the Trained Model

> **Important:** The trained model file (`model_wildfire.h5`) is not included in this repository due to its large size.

**To obtain the model:**
- Contact the repository owner or project maintainer
- Place the downloaded `model_wildfire.h5` file in the **root directory** of the project (same folder as `app.py`)

### 3. Create a Conda Environment

Open your terminal (Anaconda Prompt on Windows) and create a new environment named `fire_env` with Python 3.8:

```bash
conda create -n fire_env python=3.8 -y
```

### 4. Activate the Environment

```bash
conda activate fire_env
```

### 5. Install Dependencies

Install the required Python packages using `pip`:

```bash
pip install flask tensorflow==2.4.0 numpy==1.19.5 h5py==2.10.0 pillow opencv-python
```

*Note: If you encounter issues with specific versions, you can try installing the latest versions, but the model was trained with these specific versions in mind.*

## 🎮 Running the Application

### 1. Start the Flask Server

In your terminal (with the `fire_env` environment activated), run:

```bash
python app.py
```

### 2. Access the Web Interface

Open your web browser and go to: [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

## 📖 Usage

1. **Home Page**: Read about the project and click "Get Started"
2. **Prediction Page**:
   - Click the upload area or drag-and-drop an image
   - The image will be previewed
   - Click "Analyze Image" to get the prediction
   - The result ("Fire Detected" or "No Fire") will be displayed

## 🛠️ Troubleshooting

- **TensorFlow Errors**: If you see errors related to TensorFlow, ensure you are using the correct Python version (3.8 recommended for the specified TF version) and that your PC supports the installed TensorFlow binary
- **Model Not Found**: Make sure `model_wildfire.h5` is in the same folder as `app.py`
- **Port Already in Use**: If port 5000 is already in use, you can change it in `app.py` (last line)

## 📂 Project Structure

```
forest_fire_model/
├── app.py                  # Flask application
├── model_wildfire.h5       # Trained model (not in repo)
├── requirements.txt        # Python dependencies
├── README.md              # This file
├── templates/
│   ├── home.html          # Landing page
│   └── predict.html       # Prediction interface
└── static/
    ├── css/
    │   └── style.css      # Styles
    ├── js/
    │   └── script.js      # Client-side logic
    └── uploads/           # Uploaded images (gitignored)
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📝 License

This project is open source and available for educational purposes.

---

Made with ❤️ for forest conservation