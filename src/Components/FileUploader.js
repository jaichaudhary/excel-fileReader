import React, { useRef, useState } from "react";
import xlsx from "xlsx";
import "./FileUploader.css";
import { useDrop } from "react-dnd";
import { HeaderNameCard } from "./HeaderNameCard";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";

import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { BarChart } from "./BarChart";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function FileUploader() {
  const hiddenFileInput = useRef(null);
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [basket, setBasket] = useState([]);
  const [page, setPage] = useState(0);
  const [coin, setCoin] = useState(1); //if 1 the table if 2 then chart
  const [axis, setAxis] = useState(1); //if 1 the xAxis if 2 then yAxis
  const [rowsPerPage, setRowsPerPage] = useState(5);

  console.log("keys = ", basket);

  const [{ isOver }, dropRef] = useDrop({
    accept: "pet",
    drop: (item) => {
      console.log("item", item);
      setBasket((basket) =>
        !basket.includes(item.name) ? [...basket, item.name] : basket
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleReset = () => {
    hiddenFileInput.current.value = null;
    setData([]);
    setKeys([]);
    setBasket([]);
    setPage(0);
    setCoin(1);
    setRowsPerPage(5);
    setAxis(1);
  };

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        setData(json);
        if (json.length > 0) {
          setKeys(Object.keys(json[0]));
        }
        console.log(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  return (
    <div className="fileUploader">
      <div className="fileUploader__btnHeader">
        <div onClick={handleClick} className="fileUploader__btn">
          <p>Upload File</p>
          <input
            type="file"
            name="upload"
            id="upload"
            ref={hiddenFileInput}
            onChange={readUploadFile}
            style={{ display: "none" }}
          />
        </div>

        <div onClick={handleReset} className="fileUploader__del">
          <p>Reset</p>
        </div>
      </div>

      {data.length > 0 && (
        <div>
          <div className="fileUploader__toggle">
            <div className="fileUploader__toggleDiv">
              <div
                onClick={() => {
                  setCoin(1);
                }}
                className="fileUploader__toggleLeft"
                style={{
                  backgroundColor: coin === 1 ? "#e3e3e3" : "#f7f5f5",
                }}
              >
                <p>Table</p>
              </div>
              <div
                onClick={() => {
                  setCoin(2);
                }}
                className="fileUploader__toggleRight"
                style={{
                  backgroundColor: coin === 2 ? "#e3e3e3" : "#f7f5f5",
                }}
              >
                <p>Chart</p>
              </div>
            </div>
          </div>
          <div className="fileUploader__dataBlock">
            <div
              className="fileUploader__leftBlock"
              style={{ backgroundColor: "#e3e3e3" }}
            >
              {keys.length > 0 &&
                keys.map((value, index) => (
                  <div key={index}>
                    <HeaderNameCard draggable id={index} name={value} />
                  </div>
                ))}
            </div>
            <div
              className="fileUploader__rightBlock"
              style={{
                backgroundColor: "#f7f5f5",
                overflow: "hidden",
              }}
              ref={dropRef}
            >
              {coin === 1 ? (
                <div>
                  {basket.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table
                        sx={{ minWidth: 650 }}
                        aria-label="custom pagination table"
                      >
                        <TableHead>
                          <TableRow>
                            {basket.length > 0 &&
                              basket.map((value, index) => (
                                <TableCell>{value}</TableCell>
                              ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.length > 0 &&
                            (rowsPerPage > 0
                              ? data.slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                              : data
                            ).map((value, index) => (
                              <TableRow style={{ height: 53 * emptyRows }}>
                                {basket.map((item, index) => {
                                  return (
                                    <TableCell
                                    // colSpan={6}
                                    >
                                      {value[item]}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TablePagination
                              rowsPerPageOptions={[
                                5,
                                10,
                                25,
                                { label: "All", value: -1 },
                              ]}
                              // colSpan={3}
                              count={data.length}
                              rowsPerPage={rowsPerPage}
                              page={page}
                              SelectProps={{
                                inputProps: {
                                  "aria-label": "rows per page",
                                },
                                native: true,
                              }}
                              onPageChange={handleChangePage}
                              onRowsPerPageChange={handleChangeRowsPerPage}
                              ActionsComponent={TablePaginationActions}
                            />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                      }}
                    >
                      <p>Drag header names here...</p>
                      {isOver && "✔"}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="fileUploader__toggle">
                    <div className="fileUploader__toggleDiv">
                      <div
                        onClick={() => {
                          setAxis(1);
                        }}
                        className="fileUploader__toggleLeft"
                        style={{
                          backgroundColor: axis === 1 ? "#e3e3e3" : "#f7f5f5",
                        }}
                      >
                        <p>X-Axis</p>
                      </div>
                      <div
                        onClick={() => {
                          setAxis(2);
                        }}
                        className="fileUploader__toggleRight"
                        style={{
                          backgroundColor: axis === 2 ? "#e3e3e3" : "#f7f5f5",
                        }}
                      >
                        <p>Y-Axis</p>
                      </div>
                    </div>
                  </div>
                  <BarChart axis={axis} data={data} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
