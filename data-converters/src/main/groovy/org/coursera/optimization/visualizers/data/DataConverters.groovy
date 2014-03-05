package org.coursera.optimization.visualizers.data

import static org.coursera.optimization.visualizers.data.converters.Converters.*
import static org.coursera.optimization.visualizers.data.indexers.Indexers.*

class DataConverters {

    static configCLI() {
        def cli = new CliBuilder(usage:'dataProcessors <task> <inputDir> <outputDir>', header:'Tasks:', width: 70, posix: false)
        cli.formatter.optPrefix = ""
        cli.formatter.leftPadding = 3

        cli.with {
            convertTsp '-   convert raw TSP problem definitions to JSON format'
            convertVrp '—   convert raw VRP problem definitions to JSON format'
            indexTsp   '-   index converted TSP problem definitions'
            indexVrp   '-   index converted VRP problem definitions'
        }
        return cli
    }

    static handleTaskCall(taskName, inputDir, outputDir) {
        switch (taskName) {
            case 'convertTsp': return convertTSPs(inputDir, outputDir)
            case 'convertVrp': return convertVRPs(inputDir, outputDir)
            case 'indexTsp': return indexTSPs(inputDir, outputDir)
            case 'indexVrp': return indexVRPs(inputDir, outputDir)
        }
    }

    static main(args) {
        def cli = configCLI()
        def parsedArgs = cli.parse(args).arguments()

        switch (parsedArgs) {
            case [['help'], ['-help'], ['?'], []]:
                cli.usage();
                break;
            case { it.size == 3 && it[0] in ['convertTsp', 'convertVrp', 'indexTsp', 'indexVrp']}:
                handleTaskCall parsedArgs[0], parsedArgs[1], parsedArgs[2]
                break;
            default:
                println 'Illegal arguments provided.'
                println()
                cli.usage()
        }
    }
}



