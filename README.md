# issue-tracker-report
quick script to generate a number of issues created / waiting blocked / resolved

install dependencies
`npm install`

The script expects the following environment variables:
```
TRELLO_API_KEY
TRELLO_API_TOK
BOARD_ID
```
run
`node index.js YYYY-MM-DD YYYY-MM-DD`

The output:

```
Issue Tracker Weekly Update:
2 Issues Waiting
0 Issues Blocked
6 Issues created this week
5 Issues resolved this week
```

