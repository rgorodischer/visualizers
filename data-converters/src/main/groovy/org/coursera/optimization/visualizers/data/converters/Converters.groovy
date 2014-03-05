package org.coursera.optimization.visualizers.data.converters

import groovy.util.logging.Log

/**
 * @author roman.gorodyshcher
 */
@Log
class Converters {

    static convertTSPs(String inputDir, String outputDir) {
        log.info "Converting TSPs."
        convertAll new TspConverter(), inputDir, outputDir
    }

    static convertVRPs(String inputDir, String outputDir) {
        log.info "Converting VRPs."
        convertAll new VrpConverter(), inputDir, outputDir
    }

    private static convertAll(Converter converter, String inputDir, String outputDir) {
        log.info "Converting files from $inputDir and storing results in $outputDir:"
        new File(inputDir).eachFile { file ->
            log.info "..converting $file.name"
            def convertedJson = converter.convert file
            new File(outputDir, "${file.name}.json").write convertedJson
        }
        log.info "Done."
    }
}
