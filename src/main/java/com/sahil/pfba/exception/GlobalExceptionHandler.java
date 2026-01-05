package com.sahil.pfba.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception ex){
        ApiError apiError=new ApiError(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
            "Something went wrong. Please try again.",
            null
        );
        return ResponseEntity
               .status(HttpStatus.INTERNAL_SERVER_ERROR)
               .body(apiError);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationExceptions(MethodArgumentNotValidException ex){
        Map<String,String> errors=new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(error->{
            errors.put(error.getField(), error.getDefaultMessage());
        });

        ApiError apiError=new ApiError(
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "Input validation failed",
            errors
        );
        return ResponseEntity
               .status(HttpStatus.BAD_REQUEST)
               .body(apiError);
    }

    @ExceptionHandler(InvalidExpenseOperationException.class)
    public ResponseEntity<String> handleInvalidExpenseOperation(InvalidExpenseOperationException ex){
        return ResponseEntity
               .status(HttpStatus.CONFLICT)
               .body(ex.getMessage());
    }
}
