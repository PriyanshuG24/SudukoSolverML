import os
import numpy as np
import cv2
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from keras_preprocessing.image import ImageDataGenerator
import tensorflow as tf
tf.keras.config.is_interactive_logging_enabled()
tf.keras.config.disable_interactive_logging()

# Suppress warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
tf.get_logger().setLevel('ERROR')

# Path and parameters
path = 'myData'
testRatio = 0.2
valRatio = 0.2
imageDimensions = (32, 32, 3)

# Load images and labels
images = []
classNo = []

myList = os.listdir(path)
noOfClasses = len(myList)

for x in range(noOfClasses):
    myPickList = os.listdir(os.path.join(path, str(x)))
    for y in myPickList:
        curImg = cv2.imread(os.path.join(path, str(x), y))
        curImg = cv2.resize(curImg, (32, 32))
        images.append(curImg)
        classNo.append(x)

images = np.array(images)
classNo = np.array(classNo)

# Splitting the data
X_train, X_test, Y_train, Y_test = train_test_split(images, classNo, test_size=testRatio)
X_train, X_validation, Y_train, Y_validation = train_test_split(X_train, Y_train, test_size=valRatio)

# Preprocess the images
def preProcessing(img):
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.equalizeHist(img)
    img = img / 255
    return img

X_train = np.array(list(map(preProcessing, X_train)))
X_test = np.array(list(map(preProcessing, X_test)))
X_validation = np.array(list(map(preProcessing, X_validation)))

X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], X_train.shape[2], 1)
X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], X_test.shape[2], 1)
X_validation = X_validation.reshape(X_validation.shape[0], X_validation.shape[1], X_validation.shape[2], 1)

# Data augmentation
dataGen = ImageDataGenerator(
    width_shift_range=0.1,
    height_shift_range=0.1,
    zoom_range=0.2,
    shear_range=0.1,
    rotation_range=10
)

dataGen.fit(X_train)

Y_train = tf.keras.utils.to_categorical(Y_train, noOfClasses)
Y_test = tf.keras.utils.to_categorical(Y_test, noOfClasses)
Y_validation = tf.keras.utils.to_categorical(Y_validation, noOfClasses)

# Model definition
def myModel():
    noOfFilters = 60
    sizeOfFilter1 = (5, 5)
    sizeOfFilter2 = (3, 3)
    sizeOfPool = (2, 2)
    noOfNode = 500

    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(32, 32, 1)),  # Input layer
        tf.keras.layers.Conv2D(noOfFilters, sizeOfFilter1, activation='relu'),
        tf.keras.layers.Conv2D(noOfFilters, sizeOfFilter1, activation='relu'),
        tf.keras.layers.MaxPooling2D(pool_size=sizeOfPool),
        tf.keras.layers.Conv2D(noOfFilters // 2, sizeOfFilter2, activation='relu'),
        tf.keras.layers.Conv2D(noOfFilters // 2, sizeOfFilter2, activation='relu'),
        tf.keras.layers.MaxPooling2D(pool_size=sizeOfPool),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(noOfNode, activation='relu'),
        tf.keras.layers.Dropout(0.5),
        tf.keras.layers.Dense(noOfClasses, activation='softmax')
    ])

    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001), 
                  loss='categorical_crossentropy', 
                  metrics=['accuracy'])  # Correct metric name
    return model

model = myModel()

# Training parameters
batchSizeVal = 50
epochsVal = 1
stepsPerEpoch = len(X_train) // batchSizeVal

# Using the ImageDataGenerator with flow
train_generator = dataGen.flow(X_train, Y_train, batch_size=batchSizeVal)

# Model training
history = model.fit(train_generator,
                    steps_per_epoch=stepsPerEpoch,
                    epochs=epochsVal,
                    validation_data=(X_validation, Y_validation),
                    shuffle=True)

# Evaluate the model
plt.figure(1)
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.legend(['training', 'validation'])
plt.title('Loss')
plt.xlabel('Epoch')
plt.figure(2)
plt.plot(history.history['accuracy'])
plt.plot(history.history['val_accuracy'])
plt.legend(['training', 'validation'])
plt.title('Accuracy')
plt.xlabel('Epoch')
plt.show()

score = model.evaluate(X_test, Y_test, verbose=0)
print("Test score =", score[0])
print("Test accuracy =", score[1])

# Save the trained model
model.save("model_trained_1.h5")
