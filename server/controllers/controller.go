package controllers

import (
	"fmt"

	"github.com/go-playground/validator/v10"
)

type controller struct {
	Validate *validator.Validate
}

func checkValidation(model interface{}) (string, error) {
	var validate controller
	validate.Validate = validator.New(validator.WithRequiredStructEnabled())
	err := validate.Validate.Struct(model)
	if err != nil {
		validationErrors := err.(validator.ValidationErrors)
		var errorMessages []string
		for _, e := range validationErrors {
			errorMessages = append(errorMessages, fmt.Sprintf("%s is %s", e.Field(), e.Tag()))
		}
		return errorMessages[0], err
	}
	return "", nil
}
