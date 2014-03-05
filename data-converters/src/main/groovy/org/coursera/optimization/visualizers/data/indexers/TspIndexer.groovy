package org.coursera.optimization.visualizers.data.indexers

/**
 * Creates index of converted TSP-problem files.
 *
 * Resulting JSON has the following format:
 *
 * [
 *  { "fileName": converted_file_name, "description": "N1 points" },
 *  { "fileName": converted_file_name, "description": "N2 points" },
 *  .....
 *  { "fileName": converted_file_name, "description": "Nn points" }
 * ]
 *
 *
 * @author roman.gorodyshcher
 */
class TspIndexer extends Indexer {

    @Override
    String describe(problemModel) {
        "${problemModel.size()} points"
    }
}
