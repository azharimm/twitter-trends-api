# Twitter Trends API

## 1. Location
```
[ENDPOINT] /location
```
```
[GET] https://api-twitter-trends.herokuapp.com/location
```

## 2. Trends
```
[ENDPOINT] /trends
```
```
[GET] https://api-twitter-trends.herokuapp.com/trends?location={location_path}
[EXAMPLE] https://api-twitter-trends.herokuapp.com/trends?location=indonesia
```

### Query params
| params        | desc | required |
| --------------- |:---------:|:---------:|
| location | trends location | `no` default `worldwide` |

