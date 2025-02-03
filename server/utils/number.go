package utils

import (
	"log"
	"strconv"
)

func ConvertStringToNumber(str string) (int, error) {
	number, err := strconv.Atoi(str)
	if err != nil {
		log.Println("Error Parsing :", err)
		return 0, err
	}

	return int(number), nil
}
