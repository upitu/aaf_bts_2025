import React, { useEffect, useState, useMemo } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, TablePagination, Alert, Link,
    Checkbox, IconButton, Toolbar, Tooltip, TableSortLabel, Stack, Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import { getSubmissions, deleteSubmission, deleteSubmissions } from '../../services/api';

export default function SubmissionsPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [total, setTotal] = useState(0);

    // sorting state
    const [orderBy, setOrderBy] = useState('submitted_at'); // default column
    const [order, setOrder] = useState('desc'); // 'asc' | 'desc'

    // selection state
    const [selected, setSelected] = useState([]); // array of ids

    const fetchSubmissions = async () => {
        if (!token) {
            navigate('/admin/login', { replace: true });
            return;
        }
        try {
            setLoading(true);
            setError('');
            const { items, total } = await getSubmissions(token, {
                page,
                limit: rowsPerPage,
                sort_by: orderBy,
                order,
            });
            setRows(Array.isArray(items) ? items : []);
            setTotal(Number.isFinite(total) ? total : page * rowsPerPage + (items?.length || 0));
            setSelected([]); // clear selection on new fetch
        } catch (err) {
            const msg = String(err?.message || '');
            if (msg.includes('401')) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login', { replace: true });
                return;
            }
            setError(msg || 'Failed to fetch submissions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, rowsPerPage, orderBy, order]);

    const handleChangePage = (_evt, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (evt) => {
        setRowsPerPage(parseInt(evt.target.value, 10));
        setPage(0);
    };

    const handleRequestSort = (column) => {
        if (orderBy === column) {
            setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setOrderBy(column);
            setOrder('asc');
        }
    };

    const allIds = useMemo(() => rows.map((r) => r.id), [rows]);
    const allSelected = selected.length > 0 && selected.length === rows.length;
    const someSelected = selected.length > 0 && selected.length < rows.length;

    const toggleSelectAll = (e) => {
        if (e.target.checked) setSelected(allIds);
        else setSelected([]);
    };

    const toggleRow = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleDeleteOne = async (id) => {
        if (!window.confirm('Delete this submission?')) return;
        try {
            await deleteSubmission(token, id);
            // optimistic refresh
            fetchSubmissions();
        } catch (err) {
            setError(err.message || 'Failed to delete.');
        }
    };

    const handleBulkDelete = async () => {
        if (selected.length === 0) return;
        if (!window.confirm(`Delete ${selected.length} submissions?`)) return;
        try {
            await deleteSubmissions(token, selected);
            fetchSubmissions();
        } catch (err) {
            setError(err.message || 'Failed to bulk delete.');
        }
    };

    const HeaderCell = ({ id, children, align = 'left' }) => (
        <TableCell sortDirection={orderBy === id ? order : false} align={align}>
            <TableSortLabel
                active={orderBy === id}
                direction={orderBy === id ? order : 'asc'}
                onClick={() => handleRequestSort(id)}
            >
                {children}
            </TableSortLabel>
        </TableCell>
    );

    return (
        <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="h4" fontWeight="bold">Submissions</Typography>
                <Stack direction="row" spacing={1}>
                    <Tooltip title="Refresh">
                        <IconButton onClick={fetchSubmissions}><RefreshIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="Delete selected">
                        <span>
                            <IconButton
                                onClick={handleBulkDelete}
                                disabled={selected.length === 0}
                                color="error"
                            >
                                <DeleteIcon />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Stack>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Toolbar
                    sx={{
                        pl: { sm: 2 },
                        pr: { sm: 2 },
                        minHeight: 48,
                        ...(selected.length > 0 && {
                            bgcolor: 'action.hover',
                        }),
                    }}
                >
                    {selected.length > 0 ? (
                        <Typography variant="subtitle1">{selected.length} selected</Typography>
                    ) : (
                        <Typography variant="subtitle1" color="text.secondary">
                            Page {page + 1}
                        </Typography>
                    )}
                </Toolbar>

                <TableContainer>
                    <Table size="small" stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={someSelected}
                                        checked={allSelected}
                                        onChange={toggleSelectAll}
                                    />
                                </TableCell>
                                <HeaderCell id="name">Name</HeaderCell>
                                <HeaderCell id="email">Email</HeaderCell>
                                <HeaderCell id="mobile">Mobile</HeaderCell>
                                <HeaderCell id="emirate">Emirate</HeaderCell>
                                <HeaderCell id="submitted_at">Submitted At</HeaderCell>
                                <TableCell align="right">Receipt</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : rows.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                        No submissions yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                rows.map((row) => {
                                    const isSel = selected.includes(row.id);
                                    return (
                                        <TableRow key={row.id} hover selected={isSel}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isSel}
                                                    onChange={() => toggleRow(row.id)}
                                                />
                                            </TableCell>
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
                                            <TableCell align="right">
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteOne(row.id)}
                                                    startIcon={<DeleteIcon />}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={total}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}