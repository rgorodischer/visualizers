package org.coursera.optimization.visualizers.data.indexers

import groovy.util.logging.Log

/**
 * @author roman.gorodyshcher
 */
@Log
class Indexers {

    static indexTSPs(String inputDir, String outputDir) {
        log.info "Indexing TSPs from $inputDir, results will be stored in $outputDir folder."
        indexAll new TspIndexer(), inputDir, outputDir
    }

    static indexVRPs(String inputDir, String outputDir) {
        log.info "Indexing VRPs from $inputDir, results will be stored in $outputDir folder."
        indexAll new VrpIndexer(), inputDir, outputDir
    }

    private static indexAll(Indexer indexer, String inputDir, String outputDir) {
        def indexJson = indexer.createFilesIndex new File(inputDir)
        new File(outputDir, "index.json").write indexJson
        log.info "Done."
    }
}
