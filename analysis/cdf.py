import numpy as np
import math
import json

import matplotlib.pyplot as plt

adaptive = open('position_estimates_adaptive.json', 'r')
estimates_adaptive = json.load(adaptive)
adaptive.close()

constant = open('position_estimates_fixed.json', 'r')
estimates_fixed = json.load(constant)
constant.close()

# Reference beacon position
x1 = 2.85
y1 = 2.50

errors_adaptive = []
for estimate in estimates_adaptive:
    # Calulate the distance between each estimate
    # and the reference beacon to get the error.
    x2 = float(estimate['x'])
    y2 = float(estimate['y'])
    xd = x2 - x1
    yd = y2 - y1
    distance = math.sqrt(xd**2 + yd**2)
    errors_adaptive.append(distance)

errors_fixed = []
for estimate in estimates_fixed:
    # Calulate the distance between each estimate
    # and the reference beacon to get the error.
    x2 = float(estimate['x'])
    y2 = float(estimate['y'])
    xd = x2 - x1
    yd = y2 - y1
    distance = math.sqrt(xd**2 + yd**2)
    errors_fixed.append(distance)

sorted_data_adaptive = np.sort(errors_adaptive)
yvals_adaptive = np.arange(len(sorted_data_adaptive))/float(len(sorted_data_adaptive))

sorted_data_fixed = np.sort(errors_fixed)
yvals_fixed = np.arange(len(sorted_data_fixed))/float(len(sorted_data_fixed))

plt.plot(sorted_data_adaptive, yvals_adaptive)
plt.plot(sorted_data_fixed, yvals_fixed)

plt.legend(['Adaptive', 'Constant'], loc='upper left')

plt.show()