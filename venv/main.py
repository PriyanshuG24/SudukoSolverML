import argparse
import json
import cv2
import numpy as np
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
pathImage="resources/check.jpg"
import sys
from utlis import *  # Import utility functions from your utils file
import sudukoSolver
import tensorflow as tf
# print(tf.__version__)
# dummy_board = [
#     [5, 3, 4, 6, 7, 8, 9, 1, 2],
#     [6, 7, 2, 1, 9, 5, 3, 4, 8],
#     [1, 9, 8, 3, 4, 2, 5, 6, 7],
#     [8, 5, 9, 7, 6, 1, 4, 2, 3],
#     [4, 2, 6, 8, 5, 3, 7, 9, 1],
#     [7, 1, 3, 9, 2, 4, 8, 5, 6],
#     [9, 6, 1, 5, 3, 7, 2, 8, 4],
#     [2, 8, 7, 4, 1, 9, 6, 3, 5],
#     [3, 4, 5, 2, 8, 6, 1, 7, 9]
# ]


def convert_np_to_python(obj):
    if isinstance(obj, np.int64):
        return int(obj)
    elif isinstance(obj, dict):
        return {key: convert_np_to_python(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_np_to_python(element) for element in obj]
    else:
        return obj

def process_image(image_path):
    # Image processing settings
    heightImg = 450
    widthImg = 450
    model = intializePredictionModel()  # Initialize your prediction model

    # Read and preprocess the image
    img = cv2.imread(image_path)
    img = cv2.resize(img, (widthImg, heightImg))
    imgBlank = np.zeros((heightImg, widthImg, 3), np.uint8)
    imgThreshold = preProcess(img)

    # Find contours
    imgContours = img.copy()
    imgBigContour = img.copy()
    contours, hierarchy = cv2.findContours(imgThreshold, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(imgContours, contours, -1, (0, 255, 0), 3)

    # Find the biggest contour and use it as Sudoku
    biggest, maxArea = biggestContour(contours)
    if biggest.size != 0:
        biggest = reorder(biggest)
        cv2.drawContours(imgBigContour, biggest, -1, (0, 0, 255), 25)
        pts1 = np.float32(biggest)
        pts2 = np.float32([[0, 0], [widthImg, 0], [0, heightImg], [widthImg, heightImg]])
        matrix = cv2.getPerspectiveTransform(pts1, pts2)
        imgWarpColored = cv2.warpPerspective(img, matrix, (widthImg, heightImg))
        imgDetectedDigits = imgBlank.copy()
        imgWarpColored = cv2.cvtColor(imgWarpColored, cv2.COLOR_BGR2GRAY)

        # Split the image and find each digit
        imgSolvedDigits = imgBlank.copy()
        boxes = splitBoxes(imgWarpColored)
        numbers = getPredictions(boxes, model)
        imgDetectedDigits = displayNumbers(imgDetectedDigits, numbers, color=(255, 0, 255))
        numbers = np.asarray(numbers)
        posArray = np.where(numbers > 0, 0, 1)

        # Find solution of the board
        board = np.array_split(numbers, 9)
        # try:
        #     sudukoSolver.solve(board)
        # except :
        #    pass
        flatList = []
        for sublist in board:
            for item in sublist:
                flatList.append(item)
        result={"solution":flatList}
        return result

def main():
    try:
        if len(sys.argv) != 2:
            raise ValueError("Usage: python script.py <image_path>")
        
        image_path = sys.argv[1]
        result = process_image(image_path)
        result=convert_np_to_python(result)
        print(json.dumps(result))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)

if __name__ == "__main__":
    main()






# print('Setting UP')
# import os
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
# from utlis import *
# import sudukoSolver
# pathImage="resources/check.jpg"
# heightImg=450
# widthImg=450
# model=intializePredictionModel()


# # 1.PREPARE THE IMAGE
# img=cv2.imread(pathImage)
# img=cv2.resize(img,(widthImg,heightImg))
# imgBlank=np.zeros((heightImg,widthImg,3),np.uint8)
# imgThreshold=preProcess(img)
# # print(heightImg,widthImg,imgThreshold)

# # 2. Find all contours

# imgContours=img.copy() #copy image display purposes
# imgBigContour=img.copy() #copy image for display purposes
# contours,hierarchy=cv2.findContours(imgThreshold,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
# cv2.drawContours(imgContours,contours,-1,(0,255,0),3) # draw all detected contours

# # 3.Find the biggest countors ans use it as suduko
# biggest,maxArea=biggestContour(contours)
# # print(biggest)
# if biggest.size!=0:
#     biggest=reorder(biggest)
#     # print(biggest)
#     cv2.drawContours(imgBigContour,biggest,-1,(0,0,255),25) 
#     pts1=np.float32(biggest)
#     pts2=np.float32([[0,0],[widthImg,0],[0,heightImg],[widthImg,heightImg]])
#     matrix=cv2.getPerspectiveTransform(pts1,pts2)
#     imgWarpColored=cv2.warpPerspective(img,matrix,(widthImg,heightImg))
#     imgDetectedDigits=imgBlank.copy()
#     imgWarpColored=cv2.cvtColor(imgWarpColored,cv2.COLOR_BGR2GRAY)


#     # 4.SPLIT THE IMAGE AND FIND EACH DIGIT AVAILABLE

#     imgSolvedDigits=imgBlank.copy()
#     boxes=splitBoxes(imgWarpColored)
#     # print(len(boxes))
#     # cv2.imshow("sample",boxes[80])
#     numbers=getPredictions(boxes,model)
#     # print("numbers")
#     # print(numbers)

#     imgDetectedDigits=displayNumbers(imgDetectedDigits,numbers,color=(255,0,255))
#     numbers=np.asarray(numbers)
#     posArray=np.where(numbers>0,0,1)
#     # print("posArray")
#     # print(posArray)

#     #### 5. FIND SOLUTION OF THE BOARD
#     board = np.array_split(numbers,9)
#     # print("board")
#     # print(board)
#     try:
#         sudukoSolver.solve(board)
#     except:
#         pass
#     # print("board")
#     # print(board)
#     # solution = board
#     # solution_list = [num for row in solution for num in row]
#     # print(solution_list)
#     flatList = []
#     for sublist in board:
#         for item in sublist:
#             flatList.append(item)
#     solvedNumbers =flatList*posArray
#     print("solvednumbers")
#     print(solvedNumbers.dtype)
#     imgSolvedDigits= displayNumbers(imgSolvedDigits,solvedNumbers)

#     # #### 6. OVERLAY SOLUTION
#     pts2 = np.float32(biggest) # PREPARE POINTS FOR WARP
#     pts1 =  np.float32([[0, 0],[widthImg, 0], [0, heightImg],[widthImg, heightImg]]) # PREPARE POINTS FOR WARP
#     matrix = cv2.getPerspectiveTransform(pts1, pts2)  # GER
#     imgInvWarpColored = img.copy()
#     imgInvWarpColored = cv2.warpPerspective(imgSolvedDigits, matrix, (widthImg, heightImg))
#     inv_perspective = cv2.addWeighted(imgInvWarpColored, 1, img, 0.5, 1)
#     imgDetectedDigits = drawGrid(imgDetectedDigits)
#     imgSolvedDigits = drawGrid(imgSolvedDigits)

#     imageArray=([img,imgThreshold,imgContours,imgBigContour,imgDetectedDigits,imgSolvedDigits,imgInvWarpColored,inv_perspective])
#     stackedImage=stackImages(imageArray,0.3)
#     cv2.imshow('Stacked Images', stackedImage)
#     cv2.waitKey(0)
#     cv2.destroyAllWindows()
# else:
#     print("No suduko found")