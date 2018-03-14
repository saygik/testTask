AWS.config.update({
    region: "us-east-1",
    accessKeyId: "AKIAJWLOAG7OUN37Y4CA",
    secretAccessKey: "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"
});


var docClient = new AWS.DynamoDB.DocumentClient();
var params = {
    TableName: "Events",
    ProjectionExpression: "EventId,#yr,#tm, Description",

    ExpressionAttributeNames: {
        "#yr": "Date",
        "#tm": "Time",

    }
};
function scanData() {
    docClient.scan(params, onScan);
    function onScan(err, data) {
        if (err) {
            console.log("Unable to scan the table: " + "\n" + JSON.stringify(err, undefined, 2))
        } else {
            data.Items.forEach(function(movie) {
                document.getElementById('textarea').innerHTML += movie.Date + ": " + movie.Description  + "\n";
            });

        }
    }
}


class TableEvent extends React.Component {

        render() {
            var divStyle = {
                fontSize :14,
                color: "#999"
            };
            var allEvents = this.props.dateevents.map( (index) => {
                    return (
                <tr>
                  <td>{index.eventid} </td>
                 <td>{index.time} </td>
                 <td>{index.description} </td>
                </tr>
        )
        })
            return (
                <div>
                <table width="100%" style={divStyle}>
                {allEvents}
                </table>
                </div>
        )
        }
    }
class TableDates extends React.Component {
    constructor() {
        super();
        this.state = {
            calevents: []
        }
    }
    componentDidMount() {
        const self = this;

        docClient.scan(params, onScan);
        function onScan(err, data) {
            if (err) {
                console.log("Unable to scan the table: " + "\n" + JSON.stringify(err, undefined, 2))
            } else {
                var sortedEvents=data.Items.sort(function(a,b) {
                    var comparison = 0;
                    if (a.Date > b.Date) {
                        comparison = 1;
                    } else if (a.Date < b.Date) {
                        comparison = -1;
                    } else {
                        if (a.Time > b.Time) {
                            comparison = 1;
                        } else if(a.Time < b.Time) {
                            comparison = -1;
                        }
                    }
                    return comparison;

                })
                var group_to_values = sortedEvents.reduce(function (obj, item) {
                    obj[item.Date] = obj[item.Date] || [];
                    obj[item.Date].push({eventid:item.EventId,time:item.Time,description:item.Description});
                    return obj;
                }, {});

                var groups = Object.keys(group_to_values).map(function (key) {
                    return {date: key, events: group_to_values[key]};
                });
                //         console.log(groups)

                self.setState({calevents: groups})
            }
        }
    }
    render() {
        var allDates = this.state.calevents.map( (index) => {
                return (
            <tr>
            <td>{index.date} </td>
        <td>
        <TableEvent dateevents={index.events}/>
        </td>
        </tr>
    )
    })
        return (
            <div>
            <table >
            {allDates}
            </table>
            </div>)
    }

}
ReactDOM.render(<TableDates />, document.getElementById('root'));
