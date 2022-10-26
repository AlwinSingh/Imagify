# -*- coding: utf-8 -*-

import cv2
import numpy as np
import matplotlib.pyplot as plt

# Load Image
def read_file(filename):
  img = cv2.imread(filename)
  # Below line is required to add color to the image
  img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
  return img

# To create cartoons / animations, EDGES are extremely important
# we will highlight the edges more, create an edge mask
# The fn takes in a input image and outputs the EDGES of the image
# line_size is the thickness of the edges
def edge_mask(img, line_size, blur_value):
  gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
  gray_blur = cv2.medianBlur(gray, blur_value)
  edges = cv2.adaptiveThreshold(gray_blur, 255,
                                cv2.ADAPTIVE_THRESH_MEAN_C,
                                cv2.THRESH_BINARY,
                                line_size,
                                blur_value)
  return edges

# Reduce the color palette
# The k in the fn below dictates how many prominent colors appear in the quantised image
def color_quantisation(img, k):
  # Transform the image, reshaping data
  data = np.float32(img).reshape((-1,3))

  # Determine the criteria
  criteria = (cv2.TERM_CRITERIA_EPS+ cv2.TERM_CRITERIA_MAX_ITER, 20, 0.001)

  # Implementing K-Means Clustering
  # k -> cenroids
  ret, label, center = cv2.kmeans(data, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
  center = np.uint8(center)

  result = center[label.flatten()]
  result = result.reshape(img.shape)

  return result

# Merge the mask edge and the (quantised + blurred) image
def create_cartoon(blurred,edges):
  cartoonImg = cv2.bitwise_and(blurred, blurred, mask=edges)
  return cartoonImg

def run_cartoonify(img):
  line_size, blur_value = 9, 9
  #img = read_file(image_path)
  edges = edge_mask(img, line_size, blur_value)
  img = color_quantisation(img, k=9)
  img = cv2.cvtColor(img, cv2.COLOR_RGBA2RGB) # Needed to handle backgroundless images
  blurred = cv2.bilateralFilter(img, d=4, sigmaColor=150, sigmaSpace=150)
  cartoonified_image = create_cartoon(blurred, edges)
  return cartoonified_image

# Compare the Original vs the Cartoonised Image
#cartoonified_image = create_cartoon(blurred,edges)
#lt.title("Cartoonified Image")
#plt.imshow(cartoonified_image)
#plt.show()

#original_img = read_file(filename)
#plt.title("Original Image")
#plt.imshow(original_img)
#plt.show()