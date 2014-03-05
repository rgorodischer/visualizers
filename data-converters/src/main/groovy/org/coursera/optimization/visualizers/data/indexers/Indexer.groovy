package org.coursera.optimization.visualizers.data.indexers

import groovy.json.JsonSlurper
import groovy.json.JsonBuilder

/**
 * Creates converted files index in JSON format.
 * Index is an array of Indexer.Entry instances.
 * Each entry contains corresponding file name and computed file description.
 *
 * Entries are sorted by numerical part in 'fileName' field.
 *
 * @author roman.gorodyshcher
 */
abstract class Indexer {

    static class Entry {
        String fileName
        String description
    }

    /**
     * Creates index of files which are placed in @convertedFilesFolder.
     *
     * @param convertedFilesFolder - folder with converted files
     * @return JSON string
     */
    final def createFilesIndex(File convertedFilesFolder) {
        def index = []
        def jsonParser = new JsonSlurper()
        convertedFilesFolder.eachFile { convertedFile ->
            def problemModel = jsonParser.parse(convertedFile.newReader())
            def description = describe problemModel
            index << new Entry(fileName: convertedFile.name, description: description)
        }
        index.sort { it.fileName.findAll(/\d+/)*.toInteger() }
        return new JsonBuilder(index).toString()
    }

    abstract String describe(problemModel)
}