package org.coursera.optimization.visualizers.data.converters

/**
 * @author roman.gorodyshcher
 */
public interface Converter {

    /**
     * Converts raw problem specification to JSON format
     *
     * @param rawFile - original problem specification
     * @return JSON string
     */
    String convert(File rawFile)
}