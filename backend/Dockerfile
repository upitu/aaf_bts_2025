# Use an official Python runtime as a parent image.
# The 'slim' variant is a good compromise between size and having necessary tools.
FROM python:3.11-slim

# Set the working directory in the container to /app
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
# --no-cache-dir reduces the image size by not storing the pip cache.
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire 'app' directory from your local machine to the /app directory in the container.
# This contains all your FastAPI source code.
COPY ./app /app/app

# Command to run the application.
# Uvicorn is the ASGI server that will run your FastAPI application.
# --host 0.0.0.0 makes the server accessible from outside the container.
# --port 8000 is the port inside the container that the server will listen on.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]