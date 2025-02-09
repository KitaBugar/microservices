package utils

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
)

type Response struct {
	Items       interface{} `json:"items"`
	Message     string      `json:"message"`
	NextPage    string      `json:"next_page"`
	PrevPage    string      `json:"prev_page"`
	CurrentPage string      `json:"current_page"`
}

func ToResponse(r *http.Request, items interface{}, message string) *Response {
	q := r.URL.Query()
	page, _ := strconv.Atoi(q.Get("page"))
	if page <= 0 {
		page = 0
	}
	nextPage := page
	prevPage := page
	if page <= 0 {
		nextPage = page + 1
		prevPage = page
	} else {
		nextPage = page + 1
		prevPage = page - 1
	}
	path := r.URL.Path
	parseNextPage := "page=" + strconv.Itoa(nextPage)
	parsePrevPage := "page=" + strconv.Itoa(prevPage)
	parseCurrentPage := "page=" + strconv.Itoa(page)
	urlNextPage := fmt.Sprintf("%s%s?%s", os.Getenv("APP_URL"), path, parseNextPage)
	urlPrevPage := fmt.Sprintf("%s%s?%s", os.Getenv("APP_URL"), path, parsePrevPage)
	urlCurrentPage := fmt.Sprintf("%s%s?%s", os.Getenv("APP_URL"), path, parseCurrentPage)
	return &Response{
		Items:       items,
		Message:     message,
		NextPage:    urlNextPage,
		PrevPage:    urlPrevPage,
		CurrentPage: urlCurrentPage,
	}
}
