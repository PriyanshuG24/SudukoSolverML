import cv2
import numpy as np
import tensorflow as tf
import absl.logging
absl.logging.set_verbosity(absl.logging.ERROR)
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

width = 640
height = 480
threshold=0.65

cap = cv2.VideoCapture(0)  # Try using index 0
cap.set(3, width)
cap.set(4, height)

model = tf.keras.models.load_model('model_trained.h5')  # Load Keras model

def preProcessing(img):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.equalizeHist(img)
    img = img / 255
    return img

while True:
    success, imgOriginal = cap.read()
    if not success:
        print("Failed to capture image")
        break

    # Check if imgOriginal is valid
    if imgOriginal is None:
        print("Captured image is None")
        continue

    print(f"Captured image shape: {imgOriginal.shape}")

    img = np.asarray(imgOriginal)
    img = cv2.resize(img, (32, 32))
    img = preProcessing(img)
    cv2.imshow("Processed img", img)
    img=img.reshape(1,32,32,1)
    #predict
    predictions = model.predict(img)
    # print(predictions)
    classIndex = np.argmax(predictions, axis=1)
    # print(classIndex)
    probVal=np.amax(predictions)
    print(int(classIndex),probVal)

    if(probVal>threshold):
        cv2.putText(imgOriginal,str(classIndex)+" "+str(probVal),
                    (50,50),cv2.FONT_HERSHEY_COMPLEX,
                    1,(0,0,255),1)
    cv2.imshow("original image",imgOriginal)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
