package utils

import "time"

func GetExpiryDate(purchaseDate time.Time) time.Time {
	expiryDate := purchaseDate.AddDate(0, 1, 0)

	if expiryDate.Day() < purchaseDate.Day() {
		expiryDate = time.Date(expiryDate.Year(), expiryDate.Month()+1, 0, 23, 59, 59, 0, expiryDate.Location())
	}

	return expiryDate
}
