import matplotlib.pyplot as plt


class Filter:

    def __init__(self, q, r, p, x):
        self.q = q # process noise importance
        self.r = r # sensor noise (expected noise)
        self.p = p # estimated error
        self.x = x # estimated value
        self.k = 0 # gain

    def update(self, measurment):
        self.p = self.p + self.q
        self.k = self.p / (self.p + self.r)
        self.x = self.x + self.k * (measurment - self.x)
        self.p = (1 - self.k) * self.p
        return self.x


raw_rssi_file = open('debug.dat', 'r')
raw_rssi = []

for line in raw_rssi_file:
    raw_rssi.append(float(line.strip()))

raw_rssi_file.close()
filter = Filter(0.05, 10.0, 1.0, 1.0)
filtered_rssi = []

for index, item in enumerate(raw_rssi):
    filtered_rssi.append(filter.update(raw_rssi[index]))

plt.plot(raw_rssi, color='b', marker=None)
plt.plot(filtered_rssi, color='r', marker=None)
plt.show()
