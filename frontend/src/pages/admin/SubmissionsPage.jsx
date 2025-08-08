import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, TablePagination, Alert } from '@mui/material';
import { getSubmissions } from '../../services/api';

const SubmissionsPage = ({ token }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(100); // In a real app, your API should return the total count

    useEffect(() => {
        const fetchSubmissions = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await getSubmissions(token, page, rowsPerPage);
                setSubmissions(data);
                // In a real app, you'd get this from an API response header or body
                // setTotalCount(response.totalCount); 
            } catch (err) {
                setError(err.message || "Failed to fetch submissions.");
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, [token, page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Submissions
            </Typography>
            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Mobile</TableCell>
                                <TableCell>Emirate</TableCell>
                                <TableCell>Submitted At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{py: 5}}><CircularProgress /></TableCell>
                                </TableRow>
                            ) : (
                                submissions.map((row) => (
                                    <TableRow key={row.id} hover>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.mobile}</TableCell>
                                        <TableCell>{row.emirate}</TableCell>
                                        <TableCell>{new Date(row.submitted_at).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
};

export default SubmissionsPage;
