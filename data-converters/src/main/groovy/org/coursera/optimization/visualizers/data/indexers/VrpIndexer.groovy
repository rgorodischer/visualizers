package org.coursera.optimization.visualizers.data.indexers

/**
 * Creates index of converted VRP-problem files.
 *
 * Resulting JSON has the following format:
 *
 * [
 *  { "fileName": converted_file_name, "description": "N1 customers, V1 vehicles of capacity C1" },
 *  { "fileName": converted_file_name, "description": "N2 customers, V2 vehicles of capacity C2" },
 *  .........
 *  { "fileName": converted_file_name, "description": "Nn customers, Vn vehicles of capacity Cn" }
 * ]
 *
 * @author roman.gorodyshcher
 */
class VrpIndexer extends Indexer {

    @Override
    String describe(problemModel) {
        "${problemModel.customers.size()} customers and $problemModel.vehicles vehicles of capacity $problemModel.capacity"
    }
}
