# read in fakedb template json
fakedb <- jsonlite::fromJSON('fakedb.json')

# copy
makedb <- fakedb

# sampling vectors
ALL_GMA_IDs        <- unique(makedb$volumes$gma_id)
TONER_TYPES        <- c('ymc', 'k')
TONER_COUNT_RANGE  <- 0:9
DATE_RANGE         <- seq(as.Date('2017-09-01'), as.Date('2017-09-30'), 'days')
EXPENSES_SUM_RANGE <- 9:499

i <- 0
id_picker <- 1
makedb$volumes <-
  lapply(1:(length(ALL_GMA_IDs) * length(DATE_RANGE)), function(noop) {
  i <<- i + 1
  if (i > 30) {
    i <<- 1
    id_picker <<- id_picker + 1
  }
  gma_id <- ALL_GMA_IDs[id_picker]
  return(list(gma_id=gma_id,
              country=sample(
                makedb$equipments[makedb$equipments$gma_id==gma_id, 'country'],
              1),
              toner_type=sample(TONER_TYPES, 1),
              toner_count=sample(TONER_COUNT_RANGE, 1),
              date=DATE_RANGE[i]))
})

makedb$expenses <- lapply(makedb$volumes, function(doc) {
  return(list(gma_id=doc$gma_id,
              country=doc$country,
              expenses_sum=ifelse(doc$toner_count == 0,
                                  0,
                                  sample(EXPENSES_SUM_RANGE, 1)),
              date=doc$date))
})

makedb_json <- jsonlite::toJSON(makedb, auto_unbox=TRUE)

cat(makedb_json, file='makedb.json')