const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Middleware: Auth Check ---
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'No token provided' });

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(403).json({ error: 'Invalid token' });

    req.user = user;
    next();
};

// --- AI Logic Simulation ---
const calculateDelayRisk = (pickup, drop) => {
    const risk = Math.floor(Math.random() * 100);
    let category = 'Low';
    if (risk > 70) category = 'High';
    else if (risk > 30) category = 'Medium';
    return { risk, category, message: risk > 70 ? 'High traffic detected on route' : 'Optimal conditions' };
};

// --- Routes ---

app.get('/', (req, res) => {
    res.send('FleetSight API v2 Active');
});

// Dashboard Stats (Protected)
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const { data: vehicles } = await supabase.from('vehicles').select('*');
        const { data: deliveries } = await supabase.from('deliveries').select('*');

        const activeDeliveries = deliveries?.filter(d => d.status === 'In Transit').length || 0;
        const idleVehicles = vehicles?.filter(v => v.status === 'Idle').length || 0;
        const delayedShipments = deliveries?.filter(d => d.status === 'Delayed').length || 0;

        res.json({
            activeDeliveries,
            idleVehicles,
            delayedShipments,
            totalVehicles: vehicles?.length || 0,
            totalDeliveries: deliveries?.length || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Fleet Management
app.get('/api/fleet', authenticateToken, async (req, res) => {
    const { data, error } = await supabase.from('vehicles').select('*, drivers(*)');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/fleet/vehicles', authenticateToken, async (req, res) => {
    const { vin, type, capacity, driver_id } = req.body;
    const { data, error } = await supabase.from('vehicles').insert([{ vin, type, capacity, driver_id, status: 'Idle' }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// Deliveries
app.get('/api/deliveries', authenticateToken, async (req, res) => {
    const { data, error } = await supabase.from('deliveries').select('*, vehicles(*)');
    if (error) return res.status(500).json({ error: error.message });

    const enhancedData = data.map(d => ({
        ...d,
        aiRisk: calculateDelayRisk(d.pickup_location, d.drop_location)
    }));

    res.json(enhancedData);
});

app.post('/api/deliveries', authenticateToken, async (req, res) => {
    const { pickup_location, drop_location, customer_name, eta } = req.body;
    const { data, error } = await supabase.from('deliveries').insert([{
        pickup_location,
        drop_location,
        customer_name,
        eta,
        status: 'Pending'
    }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

app.post('/api/deliveries/:id/assign', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { vehicle_id } = req.body;

    const { error: deliveryError } = await supabase.from('deliveries')
        .update({ vehicle_id, status: 'In Transit' })
        .eq('id', id);

    const { error: vehicleError } = await supabase.from('vehicles')
        .update({ status: 'Active' })
        .eq('id', vehicle_id);

    if (deliveryError || vehicleError) return res.status(500).json({ error: deliveryError || vehicleError });
    res.json({ success: true });
});

// Profiles & Roles
app.get('/api/profile', authenticateToken, async (req, res) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', req.user.id).single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));

module.exports = app;
