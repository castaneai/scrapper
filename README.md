# scrapper
scrapbox writer service

## Environment variables

- `SCRAPBOX_PROJECT`
- `SCRAPBOX_SID`

## Testing

```sh
npm test
```

## Deploy

```sh
gcloud builds submit --tag asia.gcr.io/$GCP_PROJECT/scrapper
```