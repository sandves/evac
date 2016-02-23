raw_rssi_file = open('debug.dat', 'r')
raw_rssi = []

for line in raw_rssi_file:
    raw_rssi.append(line.strip())

raw_rssi_file.close()

kalman_file = open('kalman.dat', 'r')
kalman = []

for line in kalman_file:
    kalman.append(line.strip())

kalman_file.close()

plottable = open('plottable.dat', 'w')
plottable.write("time, raw, kalman\n")

for index, item in enumerate(raw_rssi):
    row = "{0}, {1}, {2}\n".format(index * 500, item, kalman[index])
    plottable.write(row)

plottable.close()
