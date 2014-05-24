#!/usr/bin/env python
__author__ = 'raduy'

import json
import web
import numpy
from numpy.fft import fft, fftfreq, ifft

urls = (
    '/fft/data/(.*)/(.*)', 'get_user'
)

app = web.application(urls, globals())


def generate_signal(components, diversity):
    two_pi = 2 * numpy.pi

    t = numpy.arange(0, 10., step=0.01)
    signal = numpy.sin(two_pi * t)
    for i in xrange(components):
        signal += numpy.sin(two_pi * diversity * t)

    encoded = fft(signal)
    return {"signal": signal,
            "args": t,
            "encoded": encoded,
            "frequency": fftfreq(signal.size-2, d=0.01),
            "decoded": ifft(encoded)}


class get_user:
    def jsonify(self, numpy_list):
        result_float = numpy_list.astype(numpy.float)
        result_list = result_float.tolist()

        result_json = []
        for e in result_list:
            result_json.append({"value": e})

        return result_json

    def GET(self, components, diversity):

        #allow cors requests
        web.header('Access-Control-Allow-Origin', '*')

        fft_data = generate_signal(int(components) - 1, int(diversity))

        return json.dumps({"signal": self.jsonify(fft_data["signal"]),
                           "args": self.jsonify(fft_data["args"]),
                           "encoded": self.jsonify(fft_data["encoded"]),
                           "frequency": self.jsonify(fft_data["frequency"]),
                           "decoded": self.jsonify(fft_data["decoded"])})


if __name__ == "__main__":
    app.run()