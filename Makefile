.PHONY: build run

build:
	docker build -t scrapper .

run:
	docker run -it --rm -p 8080:8080 -e SCRAPBOX_PROJECT=$(SCRAPBOX_PROJECT) -e SCRAPBOX_SID=$(SCRAPBOX_SID) scrapper
