package org.coursera.optimization.visualizers.data.indexers

/**
 * Creates index of converted VRP-problem files.
 *
 * Resulting JSON has the following format:
 *
 * [
 *  { "fileName": converted_file_name, "description": "N1 points and V1 vehicles of capacity C1" },
 *  { "fileName": converted_file_name, "description": "N2 points and V2 vehicles of capacity C2" },
 *  .........
 *  { "fileName": converted_file_name, "description": "Nn points and Vn vehicles of capacity Cn" }
 * ]
 *
 * @author roman.gorodyshcher
 */
class VrpIndexer extends Indexer {

    @Override
    String describe(problemModel) {
        //Points number is computed as customers number plus one warehouse
        "${problemModel.customers.size() + 1} points and $problemModel.vehicles vehicles of capacity $problemModel.capacity"
    }
}
