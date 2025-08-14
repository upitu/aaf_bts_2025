import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, TablePagination, Alert, Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getSubmissions } from '../../services/api';

export default function SubmissionsPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    // We don’t get total from API (api.js returns array only), so start with a sane default.
    const [totalCount, setTotalCount] = useState(0);

    const fetchSubmissions = async () => {
        if (!token) {
            navigate('/admin/login', { replace: true });
            return;
        }
        try {
            setLoading(true);
            setError('');
            const data = await getSubmissions(token, page, rowsPerPage);
            setSubmissions(Array.isArray(data) ? data : []);
            // Best-effort total: ensure paginator can move forward if data exists.
            // If backend later returns a real total, wire it here.
            const derived = page * rowsPerPage + (Array.isArray(data) ? data.length : 0);
            setTotalCount((prev) => Math.max(prev, derived));
        } catch (err) {
            const msg = String(err?.message || '');
            if (msg.includes('401')) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login', { replace: true });
                return;
            }
            setError(err?.message || 'Failed to fetch submissions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let alive = true;
        (async () => {
            if (!alive) return;
            await fetchSubmissions();
        })();
        return () => { alive = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage]); // token read from localStorage; if you allow logout elsewhere, add token to deps

    const handleChangePage = (_evt, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (evt) => {
        setRowsPerPage(parseInt(evt.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Submissions
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <TableContainer>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Mobile</TableCell>
                                <TableCell>Emirate</TableCell>
                                <TableCell>Submitted At</TableCell>
                                <TableCell align="right">Receipt</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : submissions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                        No submissions yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                submissions.map((row, idx) => (
                                    <TableRow key={row.id ?? `${row.email}-${row.submitted_at}-${idx}`} hover>
                                        <TableCell>{row.name}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.mobile}</TableCell>
                                        <TableCell>{row.emirate}</TableCell>
                                        <TableCell>
                                            {row.submitted_at ? new Date(row.submitted_at).toLocaleString() : '—'}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.receipt_url ? (
                                                <Link href={row.receipt_url} target="_blank" rel="noopener noreferrer">
                                                    View
                                                </Link>
                                            ) : '—'}
                                        </TableCell>
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
}