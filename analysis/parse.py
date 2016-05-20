import json
import math
from filter import Filter
import numpy as np

def smooth(y, box_pts):
    box = np.ones(box_pts)/box_pts
    y_smooth = np.convolve(y, box, mode='same')
    return y_smooth

def estimate_distance(tx_power, rssi, filter=None, gamma=2.0):
    if filter:
        rssi = filter.update(rssi)
    return math.pow(10, (((tx_power - rssi)) / (10 * gamma)) - 2);
    
def write_rssi_to_file(file_in, file_out):
    test_data = open(file_in, 'r')
    beacon_frames = json.load(test_data)
    test_data.close()
    
    plottable = open(file_out, 'w')
    rssis = []
    
    initialTime = int(beacon_frames[0]['lastSeen'])
    for frame in beacon_frames:
        currentTime = int(frame['lastSeen'])
        # Convert from milliseconds to seconds
        elapsedTime = (currentTime - initialTime) / 1000.0
        rssi = frame['rssi']
        rssis.append(rssi)
        plottable.write(str(rssi) + ',' + str(elapsedTime) + '\n')

    average = sum(rssis) / float(len(rssis))
    print ('Average distance for ' + file_in + ': ' + str(average))
    
    plottable.close()
    
def write_distance_to_file(file_in, file_out, filter, gamma):
    test_data = open(file_in, 'r')
    beacon_frames = json.load(test_data)
    test_data.close()
    
    plottable = open(file_out, 'w')
    distances = []
    
    initialTime = int(beacon_frames[0]['lastSeen'])
    for frame in beacon_frames:
        currentTime = int(frame['lastSeen'])
        # Convert from milliseconds to seconds
        elapsedTime = (currentTime - initialTime) / 1000.0
        tx_power = float(frame['txPower'])
        rssi = float(frame['rssi'])
        distance = estimate_distance(tx_power, rssi, filter, gamma)
        distances.append(distance)
        plottable.write(str(distance) + ',' + str(elapsedTime) + '\n')

    average = sum(distances) / float(len(distances))
    
    print ('Average distance for ' + file_in + ': ' + str(average))
    plottable.close()
    
def write_smoothed_distance_to_file(file_in, file_out, gamma):
    test_data = open(file_in, 'r')
    beacon_frames = json.load(test_data)
    test_data.close()
    
    plottable = open(file_out, 'w')
    distances = []
    
    for frame in beacon_frames:
        tx_power = float(frame['txPower'])
        rssi = float(frame['rssi'])
        distance = estimate_distance(tx_power, rssi, None, gamma)
        distances.append(distance)
        
    smoothed = smooth(distances, 9)

    first_half = []
    last_half = []
    
    initialTime = int(beacon_frames[0]['lastSeen'])
    for idx, frame in enumerate(beacon_frames):
    	if idx < 8 or idx >= (len(beacon_frames) - 8):
    		continue
        currentTime = int(frame['lastSeen'])
        # Convert from milliseconds to seconds
        elapsedTime = (currentTime - initialTime) / 1000.0

        if elapsedTime < 30.0:
        	first_half.append(smoothed[idx])
        else:
        	last_half.append(smoothed[idx])

        plottable.write(str(smoothed[idx]) + ',' + str(elapsedTime) + '\n')

    if len(first_half) is not 0 and len(last_half) is not 0:
	    avg_first_half = sum(first_half) / len(first_half)
	    avg_last_half = sum(last_half) / len(last_half)

	    print ('Average first half: ' + str(avg_first_half))
	    print ('Average last half: ' + str(avg_last_half))

    plottable.close()
    
def write_smoothed_rssi_to_file(file_in, file_out):
    test_data = open(file_in, 'r')
    beacon_frames = json.load(test_data)
    test_data.close()
    
    plottable = open(file_out, 'w')
    distances = []
    
    for idx, frame in enumerate(beacon_frames):
        rssi = float(frame['rssi'])
        distances.append(rssi)
        
    smoothed = smooth(distances, 9)

    first_third = []
    last_two_thirds = []
    
    initialTime = int(beacon_frames[0]['lastSeen'])
    for idx, frame in enumerate(beacon_frames):
    	if idx < 4 or idx >= (len(beacon_frames) - 4):
    		continue
        currentTime = int(frame['lastSeen'])
        # Convert from milliseconds to seconds
        elapsedTime = (currentTime - initialTime) / 1000.0

        # Store data for average calculation purposes
        if elapsedTime < 30.0:
        	first_third.append(smoothed[idx])
        else:
        	last_two_thirds.append(smoothed[idx])

        plottable.write(str(smoothed[idx]) + ',' + str(elapsedTime) + '\n')

    avg_first_third = sum(first_third) / float(len(first_third))
    avg_last_two_thirds = sum(last_two_thirds) / float(len(last_two_thirds))
    print ('Average first third: ' + str(avg_first_third))
    print ('Average last two thirds: ' + str(avg_last_two_thirds))

    plottable.close()

####################### 180 cm +4dBm #####################

write_rssi_to_file('rssi_single_180cm_4dBm.json', 
    'output/rssi_single_180cm_4dBm.dat')

####################### 300 cm +4dBm #####################

write_rssi_to_file('rssi_single_3m_4dBm.json', 
    'output/rssi_single_3m_4dBm.dat')
    
#filter = Filter(0.1, 5.0, 5.0, 10.0)
write_smoothed_distance_to_file('rssi_single_3m_4dBm.json', 
    'output/distance_single_3m_4dBm.dat', 2.25)

####################### 300 cm +4dBm #####################

write_rssi_to_file('rssi_body_3m_4dBm.json', 
    'output/rssi_body_3m_4dBm.dat')
    
#filter = Filter(0.1, 1.0, 5.0, 10.0)
write_smoothed_distance_to_file('rssi_body_3m_4dBm.json', 
    'output/distance_body_3m_4dBm.dat', 2.25)

######################## 0-5m +4dBm ######################

#filter = Filter(0.1, 15.0, 0.0, 0.0)
write_smoothed_distance_to_file('rssi_single_0_to_5m_4dBm.json', 
    'output/distance_single_0_to_5m_4dBm.dat', 2.4)

################## microwave oven +4dBm #################

#filter = Filter(0.1, 15.0, 0.0, 0.0)
write_smoothed_rssi_to_file('rssi_microwave_4dBm_2.json', 
    'output/rssi_microwave_4dBm.dat')

####################### door +4dBm #######################

#filter = Filter(0.1, 15.0, 0.0, 0.0)
write_smoothed_distance_to_file('rssi_door_4dBm_ca_3m.json', 
    'output/distance_door_4dBm.dat', 1.85)
    
####################### all 3m +4dBm #####################

test_data = open('rssi_all_180cm_4dBm.json', 'r')
beacon_frames = json.load(test_data)
test_data.close()

distances = {}
elapsed_times = {}

initial_time = int(beacon_frames[0]['lastSeen'])
for frame in beacon_frames:
    id = str(frame['id'])
    rssi = float(frame['rssi'])
    if id in distances:
        distances[id].append(rssi)
    else:
        distances[id] = []
    current_time = int(frame['lastSeen'])
    if id in elapsed_times:
        elapsed_times[id].append((current_time - initial_time) / 1000.0)
    else:
        elapsed_times[id] = []
    
smoothed = {}
for key, value in distances.iteritems():
    smoothed[key] = smooth(value, 9)

for key, value in smoothed.iteritems():
    plottable = open('output/rssi_all_180cm_4dBm_' + key + '.dat', 'w')
    for idx, signal in enumerate(value):
        if signal > -60:
            continue
        elapsed_time = elapsed_times[key][idx]
        plottable.write(str(signal) + ',' + str(elapsed_time) + '\n')
    plottable.close()

############### estimote vs nexus +4dBm ###############

filename = 'rssi_estimote_vs_nexus_4dBm'
test_data = open(filename + '.json', 'r')
beacon_frames = json.load(test_data)
test_data.close()

distances = {}
elapsed_times = {}

initial_time = int(beacon_frames[0]['lastSeen'])
for frame in beacon_frames:
    id = str(frame['id'])
    rssi = float(frame['rssi'])
    tx_power = int(frame['txPower'])
    distance = estimate_distance(tx_power, rssi, filter=None, gamma=2.35)
    if id in distances:
        distances[id].append(distance)
    else:
        distances[id] = []
    current_time = int(frame['lastSeen'])
    if id in elapsed_times:
        elapsed_times[id].append((current_time - initial_time) / 1000.0)
    else:
        elapsed_times[id] = []

smoothed = {}
for key, value in distances.iteritems():
    smoothed[key] = smooth(value, 9)

for key, value in smoothed.iteritems():
    plottable = open('output/' + filename + '_' + key + '.dat', 'w')
    for idx, signal in enumerate(value):
        elapsed_time = elapsed_times[key][idx]
        plottable.write(str(signal) + ',' + str(elapsed_time) + '\n')
    plottable.close()
    
####################### interference #####################

test_data = open('rssi_interference_4dBm.json', 'r')
beacon_frames = json.load(test_data)
test_data.close()

distances = {}
elapsed_times = {}

initial_time = int(beacon_frames[0]['lastSeen'])
for frame in beacon_frames:
    id = str(frame['id'])
    rssi = float(frame['rssi'])
    if id in distances:
        distances[id].append(rssi)
    else:
        distances[id] = []
    current_time = int(frame['lastSeen'])
    if id in elapsed_times:
        elapsed_times[id].append((current_time - initial_time) / 1000.0)
    else:
        elapsed_times[id] = []
    
smoothed = {}
for key, value in distances.iteritems():
    smoothed[key] = smooth(value, 9)

for key, value in smoothed.iteritems():
    plottable = open('output/rssi_interference_4dBm_' + key + '.dat', 'w')
    for idx, signal in enumerate(value):
        if signal > -67:
            continue
        elapsed_time = elapsed_times[key][idx]
        plottable.write(str(signal) + ',' + str(elapsed_time) + '\n')
    plottable.close()
    
############# position estimates adaptive gamma ###########
test_data = open('position_estimates_adaptive.json', 'r')
estimates = json.load(test_data)
test_data.close()
plottable = open('output/position_estimates_adaptive.dat', 'w')

for estimate in estimates:
    x = float(estimate['x'])
    y = float(estimate['y'])
    if x > 0 and y > 0:
        plottable.write(str(x) + ',' + str(y) + '\n')
        
plottable.close()

########### position estimates fixed gamma (2.2) #########
test_data = open('position_estimates_fixed.json', 'r')
estimates = json.load(test_data)
test_data.close()
plottable = open('output/position_estimates_fixed.dat', 'w')

for estimate in estimates:
    x = float(estimate['x'])
    y = float(estimate['y'])
    if x > 0 and y > 0:
        plottable.write(str(x) + ',' + str(y) + '\n')
        
plottable.close()
    