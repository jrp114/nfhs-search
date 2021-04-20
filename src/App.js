import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  Select,
  TextField,
  InputLabel,
} from "@material-ui/core";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(2),
    minWidth: 200,
  },
  textField: {
    margin: theme.spacing(2),
    width: 200,
  },
  table: {
    minWidth: 650,
  },
  container: {
    paddingTop: 15,
  },
}));

function App() {
  const classes = useStyles();

  const [rows, setRows] = useState([]);
  const [hideRows, setHideRows] = useState([]);
  const [menu, setMenu] = useState([]);
  const [stateAssociated, setStateAssociated] = useState();
  const [toDate, setToDate] = useState();
  const [fromDate, setFromDate] = useState();

  useEffect(async () => {
    const resultRows = await createData();
    setHideRows(resultRows);
  }, []);

  useEffect(async () => {
    if (stateAssociated) {
      const showRows = hideRows.filter(
        (row) => row.publisher == stateAssociated
      );
      setRows(showRows);
      if (toDate && fromDate) {
        let from = new Date(fromDate).toISOString().split("T")[0];
        let to = new Date(toDate).toISOString().split("T")[0];
        const dateRows = showRows.filter(
          (row) =>
            new Date(row.date).toISOString().split("T")[0] >= from &&
            new Date(row.date).toISOString().split("T")[0] <= to
        );
        setRows(dateRows);
      }
    }
  }, [stateAssociated, toDate, fromDate]);

  const getList = async () => {
    const results = await axios.get(url);
    return {
      options: results.data.items.map((result) => result.publisher),
      results: results.data.items,
    };
  };

  const createData = async () => {
    const { results, options } = await getList();
    setMenu(options);
    let ret = [];
    for (let result of results) {
      ret.push({
        key: result.key,
        publisher: result.publisher,
        headline: result.headline,
        subheadline: result.subheadline,
        date: result.date,
        startTime: new Date(result.date).toString().split(" GMT")[0],
      });
    }
    return ret;
  };

  const handleChange = (e) => {
    setStateAssociated(e.target.value);
  };

  const updateFromDate = (e) => {
    setFromDate(e.target.value);
  };

  const updateToDate = (e) => {
    setToDate(e.target.value);
  };

  const url = `https://challenge.nfhsnetwork.com/v2/search/events/upcoming?state_association_key=18bad24aaa&card=true&size=50&start=0`;

  return (
    <div>
      <Container fixed className={classes.container}>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">
            State Associated
          </InputLabel>

          <Select
            native
            // value={age}
            onChange={handleChange}
          >
            <option></option>
            {menu.map((option) => (
              <option>{option}</option>
            ))}
          </Select>
        </FormControl>
        <TextField
          id="date"
          label="Start Date"
          type="date"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={updateFromDate}
        />
        <TextField
          id="date"
          label="End Date"
          type="date"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={updateToDate}
        />
      </Container>
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Key</TableCell>
              <TableCell align="right">Headline</TableCell>
              <TableCell align="right">SubHeadline</TableCell>
              <TableCell align="right">Start Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell align="right">{row.key}</TableCell>
                <TableCell align="right">{row.headline}</TableCell>
                <TableCell align="right">{row.subheadline}</TableCell>
                <TableCell align="right">{row.startTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
