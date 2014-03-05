package org.coursera.optimization.visualizers.data.converters

import static org.coursera.optimization.visualizers.data.converters.VrpConverter.VrpModel.*
import groovy.json.JsonBuilder

/**
 * Raw file format:
 *
 * N V C
 * D1 X1 Y1
 * D2 X2 Y2
 * ........
 * Dn Xn Yn
 *
 * N, V, C and Ds are integers, Xs and Ys are decimal numbers.
 *
 *
 * Converted file format:
 *
 * JSON-object with fields:
 *   vehicles - corresponds to V in the raw file;
 *   capacity - corresponds to C in the raw file;
 *   warehouse - JSON-object with two fields 'x' and 'y', represents warehouse location;
 *   customers - JSON-list of customers;
 *               each customer is a JSON-object with four fields: 'id', 'demand', 'x', 'y'.
 *
 * All values except for Xs and Ys are integers. Xs and Ys are decimal numbers.
 *
 * Typical output looks like this:
 * {
 *   "vehicles": int_val,
 *   "capacity": int_val,
 *   "warehouse": { "x": dec_val, "y": dec_val },
 *   "customers": [
 *     { "id": 0, "demand": int_val, "x": dec_val, "y": dec_val},
 *     { "id": 1, "demand": int_val, "x": dec_val, "y": dec_val},
 *     ............
 *     { "id": N-2, "demand": int_val, "x": dec_val, "y": dec_val},
 *   ]
 * }
 *
 *
 * @author roman.gorodyshcher
 */
class VrpConverter implements Converter {

    static class VrpModel {
        int vehicles
        int capacity
        Warehouse warehouse
        def customers = []

        static class Customer {
            int id
            int demand
            double x, y
        }

        static class Warehouse {
            double x, y
        }
    }

    @Override
    String convert(File rawFile) {
        def vrpModel = new VrpModel()

        int customerId = 0
        rawFile.eachLine { line, lineNo ->
            if (lineNo == 1) {
                def vrpParams = line.split(" ")
                vrpModel.vehicles = vrpParams[1] as int
                vrpModel.capacity = vrpParams[2] as int
            } else if (!line.trim().isEmpty()) {
                def vertexParams = line.split(" ")
                if (vertexParams[0] as int == 0) { //warehouse is detected by demand = 0
                    vrpModel.warehouse = new Warehouse(x: vertexParams[1] as double, y: vertexParams[2] as double)
                } else {
                    vrpModel.customers << new Customer(id: customerId++, demand: vertexParams[0] as int, x: vertexParams[1] as double, y: vertexParams[2] as double)
                }
            }
        }
        return new JsonBuilder(vrpModel).toString()
    }
}
