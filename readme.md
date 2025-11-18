# Forest Fire Detection Model

This project uses a Deep Learning model to detect forest fires from images. It provides a web interface for users to upload images and get real-time predictions.

## Prerequisites

- [Anaconda](https://www.anaconda.com/products/distribution) or [Miniconda](https://docs.conda.io/en/latest/miniconda.html) installed on your machine.

## Setup Instructions

1.  **Clone or Download the Repository**
    Ensure you have all the project files in a directory.

2.  **Create a Conda Environment**
    Open your terminal (Anaconda Prompt on Windows) and run the following command to create a new environment named `fire-detection` with Python 3.8:

    ```bash
    conda create -n fire-detection python=3.8 -y
    ```

3.  **Activate the Environment**

    ```bash
    conda activate fire-detection
    ```

4.  **Install Dependencies**
    Install the required Python packages using `pip`:

    ```bash
    pip install flask tensorflow==2.4.0 numpy==1.19.5 h5py==2.10.0 pillow opencv-python
    ```
    *Note: If you encounter issues with specific versions, you can try installing the latest versions, but the model was trained with these specific versions in mind.*

5.  **Verify Model File**
    Ensure the `model_wildfire.h5` file is present in the root directory of the project.

## Running the Application

1.  **Start the Flask Server**
    In your terminal (with the `fire-detection` environment activated), run:

    ```bash
    python app.py
    ```

2.  **Access the Web Interface**
    Open your web browser and go to:
    [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

## Usage

1.  **Home Page**: Read about the project and click "Get Started".
2.  **Prediction Page**:
    -   Click the "Choose File" area to select an image.
    -   The image will be previewed.
    -   Click "Analyze Image" to get the prediction.
    -   The result ("Fire Detected" or "No Fire") will be displayed.

## Troubleshooting

-   **TensorFlow Errors**: If you see errors related to TensorFlow, ensure you are using the correct Python version (3.8 recommended for the specified TF version) and that your PC supports the installed TensorFlow binary.
-   **Model Not Found**: Make sure `model_wildfire.h5` is in the same folder as `app.py`.