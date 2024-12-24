import { useEffect, useState } from 'react';
import { getReportsAll } from 'service/auth';
const AttendanceOverview = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true); // Tambahkan state untuk loading
    const [error, setError] = useState(null); // Tambahkan state untuk error handling

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading saat mulai fetch
            setError(null); // Reset error sebelum fetch data
            try {
                const response = await getReportsAll();
                setData(response);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Gagal memuat data. Silakan coba lagi.');
            } finally {
                setLoading(false); // Pastikan loading di-set ke false
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Sedang memuat data...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Data Kehadiran Guru</h1>
            {data.length > 0 ? (
                <table border="1" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Nama</th>
                            <th>Tanggal</th>
                            <th>Status</th>
                            <th>Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.tanggal}</td>
                                <td>{item.status}</td>
                                <td>{item.keterangan || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Data tidak tersedia.</p>
            )}
        </div>
    );
};

export default AttendanceOverview;
