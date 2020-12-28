# scrapper
scrapbox writer service

## Environment variables

- `SCRAPBOX_PROJECT`
- `SCRAPBOX_SID`

## Usage

```sh
make build
make run
curl -X POST -H 'Content-Type: application/json' -d '{"title":"hello","text":"world"}' http://localhost:8080
```

## Testing

```sh
npm test
```
