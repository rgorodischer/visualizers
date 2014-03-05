package org.coursera.optimization.visualizers.data.converters

import groovy.json.JsonBuilder

/**
 * Raw file format:
 *
 * N
 * X1 Y1
 * X2 Y2
 * .....
 * Xn Yn
 *
 * N is an integer, Xs and Ys are decimal numbers.
 *
 *
 * Converted file format:
 *
 * JSON-list of JSON-objects where each entry has 3 fields: ID, X, Y.
 * Xs and Ys correspond to Xs and Ys in raw file. ID is a simple lines counter which starts from 0.
 * Typical output looks like this:
 *
 * [
 *   { 'id' : 0, 'x' : dec_val, 'y' : dec_val },
 *   { 'id' : 1, 'x' : dec_val, 'y' : dec_val },
 *   { 'id' : 2, 'x' : dec_val, 'y' : dec_val },
 *
 *   ....
 *   { 'id' : N-1, 'x' : dec_val, 'y' : dec_val }
 * ]
 *
 * @author roman.gorodyshcher
 */
class TspConverter implements Converter {

    static class TspPoint {
        int id
        double x, y
    }

    @Override
    String convert(File rawFile) {
        def points = []
        rawFile.eachLine(-1) { line, lineNo ->
            if (lineNo >= 0 && !line.trim().isEmpty()) {
                def point = line.split(" ")
                points << new TspPoint(id: lineNo, x: point[0] as double, y: point[1] as double)
            }
        }
        return new JsonBuilder(points).toString()
    }
}
