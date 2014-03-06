package org.coursera.optimization.visualizers.data.indexers

/**
 * Creates index of converted VRP-problem files.
 *
 * Resulting JSON has the following format:
 *
 * [
 *  { "fileName": converted_file_name, "description": "N1 points, V1 vehicles" },
 *  { "fileName": converted_file_name, "description": "N2 points, V2 vehicles" },
 *  .........
 *  { "fileName": converted_file_name, "description": "Nn points, Vn vehicles" }
 * ]
 *
 * @author roman.gorodyshcher
 */
class VrpIndexer extends Indexer {

    @Override
    String describe(problemModel) {
        //Points number is computed as customers number plus one warehouse
        "${problemModel.customers.size() + 1} points, $problemModel.vehicles vehicles"
    }
}
