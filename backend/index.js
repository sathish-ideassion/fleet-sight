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

// --- AI Logic Simulation ---
const calculateDelayRisk = (pickup, drop) => {
    // Mock logic: higher risk if "Traffic" or "Rain" in name (demo only)
    const risk = Math.floor(Math.random() * 100);
    let category = 'Low';
    if (risk > 70) category = 'High';
    else if (risk > 30) category = 'Medium';
    return { risk, category };
};

const detectIdle = (lastUpdate) => {
    const diff = (new Date() - new Date(lastUpdate)) / (1000 * 60);
    return diff > 30; // 30 minutes idle
};

// --- Routes ---

app.get('/', (req, res) => {
    res.send('FleetSight API is running...');
});

// Fleet Stats
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const { data: vehicles } = await supabase.from('vehicles').select('*');
        const { data: deliveries } = await supabase.from('deliveries').select('*');

        const activeDeliveries = deliveries.filter(d => d.status === 'In Transit').length;
        const idleVehicles = vehicles.filter(v => v.status === 'Idle').length;
        const delayedShipments = deliveries.filter(d => d.status === 'Delayed').length;

        res.json({
            activeDeliveries,
            idleVehicles,
            delayedShipments,
            totalVehicles: vehicles.length,
            totalDeliveries: deliveries.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Vehicle Routes
app.get('/api/fleet/vehicles', async (req, res) => {
    const { data, error } = await supabase.from('vehicles').select('*, drivers(*)');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/fleet/vehicles', async (req, res) => {
    const { vin, type, capacity, driver_id } = req.body;
    const { data, error } = await supabase.from('vehicles').insert([{ vin, type, capacity, driver_id, status: 'Idle' }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// Delivery Routes
app.get('/api/deliveries', async (req, res) => {
    const { data, error } = await supabase.from('deliveries').select('*, vehicles(*)');
    if (error) return res.status(500).json({ error: error.message });
    
    // Add AI delay risk locally for demo
    const enhancedData = data.map(d => ({
        ...d,
        aiRisk: calculateDelayRisk(d.pickup_location, d.drop_location)
    }));
    
    res.json(enhancedData);
});

app.post('/api/deliveries', async (req, res) => {
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

app.post('/api/deliveries/:id/assign', async (req, res) => {
    const { id } = req.params;
    const { vehicle_id } = req.body;
    
    // Update delivery status
    const { error: deliveryError } = await supabase.from('deliveries').update({ 
        vehicle_id, 
        status: 'In Transit' 
    }).eq('id', id);
    
    // Update vehicle status
    const { error: vehicleError } = await supabase.from('vehicles').update({ 
        status: 'Active' 
    }).eq('id', vehicle_id);

    if (deliveryError || vehicleError) {
        return res.status(500).json({ error: deliveryError || vehicleError });
    }
    
    res.json({ success: true });
});

// Driver Routes
app.get('/api/drivers', async (req, res) => {
    const { data, error } = await supabase.from('drivers').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;
