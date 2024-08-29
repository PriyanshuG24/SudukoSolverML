import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import cv2
import numpy as np
import tensorflow as tf
# print('Setting UP')
import absl.logging
absl.logging.set_verbosity(absl.logging.ERROR)
tf.keras.config.is_interactive_logging_enabled()
tf.keras.config.disable_interactive_logging()

def intializePredictionModel():
    # model = tf.keras.models.load_model('model_trained.h5')
    # return model
    model_path = 'C:/Users/Priyanshu/OneDrive/Desktop/python/venv/model_trained.h5'  # Use absolute path
    model = tf.keras.models.load_model(model_path)
    return model


def preProcess(img):
    imgGray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    imgBlur = cv2.GaussianBlur(imgGray, (5, 5), 1)
    imgThreshold = cv2.adaptiveThreshold(imgBlur, 255, 1, 1, 11, 2)
    return imgThreshold

def biggestContour(contours):
    biggest = np.array([])
    max_area = 0
    for i in contours:
        area = cv2.contourArea(i)
        if area > 50:
            peri = cv2.arcLength(i, True)
            approx = cv2.approxPolyDP(i, 0.02 * peri, True)
            if area > max_area and len(approx) == 4:
                biggest = approx
                max_area = area
    return biggest, max_area

def reorder(myPoints):
    myPoints = myPoints.reshape((4, 2))
    myPointsNew = np.zeros((4, 1, 2), dtype=np.int32)
    add = myPoints.sum(1)
    myPointsNew[0] = myPoints[np.argmin(add)]
    myPointsNew[3] = myPoints[np.argmax(add)]
    diff = np.diff(myPoints, axis=1)
    myPointsNew[1] = myPoints[np.argmin(diff)]
    myPointsNew[2] = myPoints[np.argmax(diff)]
    return myPointsNew

def splitBoxes(img):
    rows = np.vsplit(img, 9)
    boxes = []
    for r in rows:
        cols = np.hsplit(r, 9)
        for box in cols:
            boxes.append(box)
    return boxes

def stackImages(imgArray, scale):
    rows = len(imgArray)
    cols = len(imgArray[0])
    rowsAvailable = isinstance(imgArray[0], list)
    width = imgArray[0][0].shape[1]
    height = imgArray[0][0].shape[0]
    if rowsAvailable:
        for x in range(0, rows):
            for y in range(0, cols):
                imgArray[x][y] = cv2.resize(imgArray[x][y], (0, 0), None, scale, scale)
                if len(imgArray[x][y].shape) == 2:
                    imgArray[x][y] = cv2.cvtColor(imgArray[x][y], cv2.COLOR_BGR2GRAY)
        imageBlank = np.zeros((height, width, 3), np.uint8)
        hor = [imageBlank] * rows
        hor_con = [imageBlank] * rows
        for x in range(0, rows):
            hor[x] = np.hstack(imgArray[x])
            hor_con[x] = np.concatenate(imgArray[x])
        ver = np.vstack(hor)
        ver_con = np.concatenate(hor)
    else:
        for x in range(0, rows):
            imgArray[x] = cv2.resize(imgArray[x], (0, 0), None, scale, scale)
            if len(imgArray[x].shape) == 2:
                imgArray[x] = cv2.cvtColor(imgArray[x], cv2.COLOR_GRAY2BGR)
        hor = np.hstack(imgArray)
        hor_con = np.concatenate(imgArray)
        ver = hor
    return ver


def getPredictions(boxes, model):
    predictions = []
    for image in boxes:
        # Preprocess the image to the correct shape (32, 32, 1)
        img = cv2.resize(image, (32, 32))
        img = img / 255.0  # Normalize the image
        img = img.reshape(1, 32, 32, 1)  # Reshape to (1, 32, 32, 1)
        
        # Predict the digit
        prediction = model.predict(img)
        classIndex = np.argmax(prediction, axis=1)
        probVal = np.amax(prediction)
        # print(probVal)
        if probVal >0.7:  # If the probability is above 80%, consider it a valid prediction
            predictions.append(classIndex[0])
        else:
            predictions.append(0)  # Consider as empty if the probability is low
    
    return predictions

def displayNumbers(img, numbers, color=(0, 255, 0)):
    secW = int(img.shape[1] / 9)
    secH = int(img.shape[0] / 9)
    for y in range(9):
        for x in range(9):
            if numbers[(y * 9) + x] != 0:
                text = str(numbers[(y * 9) + x])
                text_size = cv2.getTextSize(text, cv2.FONT_HERSHEY_COMPLEX_SMALL, 2, 2)[0]
                text_x = int(x * secW + (secW - text_size[0]) / 2)
                text_y = int((y + 1) * secH - (secH - text_size[1]) / 2)
                cv2.putText(img, text, (text_x, text_y), cv2.FONT_HERSHEY_COMPLEX_SMALL, 2, color, 2, cv2.LINE_AA)
    return img

#### 6 - DRAW GRID TO SEE THE WARP PRESPECTIVE EFFICENCY (OPTIONAL)
def drawGrid(img):
    secW = int(img.shape[1]/9)
    secH = int(img.shape[0]/9)
    for i in range (0,9):
        pt1 = (0,secH*i)
        pt2 = (img.shape[1],secH*i)
        pt3 = (secW * i, 0)
        pt4 = (secW*i,img.shape[0])
        cv2.line(img, pt1, pt2, (255, 255, 0),2)
        cv2.line(img, pt3, pt4, (255, 255, 0),2)
    return img
