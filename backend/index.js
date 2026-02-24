const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

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

// --- Realtime WebSocket Logic ---
io.on('connection', (socket) => {
    console.log('User connected to Terminal:', socket.id);

    socket.on('update-location', (data) => {
        // Broadcast vehicle location to all dashboards
        io.emit('vehicle-moved', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// --- Simple AI Intelligence (Brain.js style replacement if install fails) ---
const getAIRiskAssessment = (data) => {
    // This simulates a trained neural network response
    const trafficFactor = Math.random() * 0.8;
    const distanceFactor = 0.2;
    const score = trafficFactor + distanceFactor;

    return {
        score: (score * 100).toFixed(0),
        status: score > 0.7 ? 'CRITICAL' : (score > 0.4 ? 'WARNING' : 'HEALTHY'),
        prediction: score > 0.7 ? 'High probability of 45min delay' : 'Route optimization optimal'
    };
};

// --- Routes ---

// Dashboard Stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', req.user.id).single();
        const isAdminOrOps = profile?.role === 'Admin' || profile?.role === 'Operations Specialist' || profile?.role === 'Logistics Manager';

        const { data: drivers } = await supabase.from('drivers').select('*');
        const { data: vehicles } = await supabase.from('vehicles').select('*');
        const { data: deliveries } = await supabase.from('deliveries').select('*');

        let filteredDeliveries = deliveries || [];
        let filteredVehicles = vehicles || [];

        if (profile?.role === 'Driver') {
            const driverRecord = drivers?.find(d => d.user_id === req.user.id);
            const myVehicle = vehicles?.find(v => v.driver_id === driverRecord?.id);
            filteredDeliveries = deliveries?.filter(d => d.vehicle_id === myVehicle?.id) || [];
            filteredVehicles = myVehicle ? [myVehicle] : [];
        }

        const driverStatsMap = {};
        drivers?.forEach(d => {
            driverStatsMap[d.id] = { name: d.name, completed: 0, active: 0, delayed: 0 };
        });

        deliveries?.forEach(delivery => {
            if (delivery.vehicle_id) {
                const vehicle = vehicles?.find(v => v.id === delivery.vehicle_id);
                if (vehicle && vehicle.driver_id && driverStatsMap[vehicle.driver_id]) {
                    const stats = driverStatsMap[vehicle.driver_id];
                    if (delivery.status === 'Completed') stats.completed++;
                    else if (delivery.status === 'Delayed') stats.delayed++;
                    else stats.active++;
                }
            }
        });

        res.json({
            activeDeliveries: filteredDeliveries.filter(d => d.status === 'In Transit').length,
            idleVehicles: filteredVehicles.filter(v => v.status === 'Idle').length,
            delayedShipments: filteredDeliveries.filter(d => d.status === 'Delayed').length,
            totalVehicles: filteredVehicles.length,
            totalDeliveries: filteredDeliveries.length,
            driverStats: isAdminOrOps ? Object.values(driverStatsMap) : []
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DRIVERS
app.get('/api/drivers', authenticateToken, async (req, res) => {
    const { data, error } = await supabase.from('drivers').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/drivers', authenticateToken, async (req, res) => {
    const { name, license_number, contact_number } = req.body;
    const { data, error } = await supabase.from('drivers').insert([{ name, phone: contact_number }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data[0]);
});

// VEHICLES
app.get('/api/fleet', authenticateToken, async (req, res) => {
    const { data, error } = await supabase.from('vehicles').select('*, drivers(*)');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/fleet/vehicles', authenticateToken, async (req, res) => {
    const { vin, type, capacity, driver_id } = req.body;
    const { data, error } = await supabase.from('vehicles').insert([{ vin, type, capacity, driver_id, status: 'Idle' }]).select();
    if (error) return res.status(500).json({ error: error.message });

    io.emit('system-event', { type: 'NEW_VEHICLE', message: `Vehicle ${vin} registered.` });
    res.json(data[0]);
});

// DELIVERIES
app.get('/api/deliveries', authenticateToken, async (req, res) => {
    try {
        // Get user role
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', req.user.id).single();

        let query = supabase.from('deliveries').select('*, vehicles(*)');

        if (profile?.role === 'Driver') {
            // Find vehicle assigned to this driver
            const { data: vehicle } = await supabase.from('vehicles').select('id').eq('driver_id', (
                await supabase.from('drivers').select('id').eq('user_id', req.user.id).single()
            ).data?.id).single();

            if (vehicle) {
                query = query.eq('vehicle_id', vehicle.id);
            } else {
                return res.json([]);
            }
        }

        const { data, error } = await query;
        if (error) throw error;

        const enhancedData = data.map(d => ({
            ...d,
            aiAssessment: getAIRiskAssessment(d)
        }));

        res.json(enhancedData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/deliveries', authenticateToken, async (req, res) => {
    const {
        pickup_location, drop_location, customer_name, eta,
        pickup_lat, pickup_lng, drop_lat, drop_lng
    } = req.body;

    const { data, error } = await supabase.from('deliveries').insert([{
        pickup_location,
        drop_location,
        customer_name,
        eta,
        pickup_lat, pickup_lng, drop_lat, drop_lng,
        status: 'Pending'
    }]).select();
    if (error) return res.status(500).json({ error: error.message });

    io.emit('system-event', { type: 'NEW_DELIVERY', message: `Order for ${customer_name} created.` });
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

    if (deliveryError || vehicleError) return res.status(500).json({ error: 'Assignment failed' });

    io.emit('system-event', { type: 'ASSIGNMENT', message: `Vehicle assigned to delivery #${id}` });
    res.json({ success: true });
});

app.post('/api/onboard', authenticateToken, async (req, res) => {
    try {
        const { email, password, full_name, role } = req.body;

        // Verify only admins can onboard
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', req.user.id).single();
        if (profile?.role !== 'Admin') {
            return res.status(403).json({ error: 'Only admins can onboard personnel.' });
        }

        // Use a separate Supabase instance to not override auth
        const adminSupabase = createClient(supabaseUrl, supabaseAnonKey);

        const { data, error } = await adminSupabase.auth.signUp({
            email,
            password,
            options: {
                data: { full_name, role }
            }
        });

        if (error) throw error;

        // Ensure email_confirmed_at is updated using our DB trigger, or just return success
        // Also if the role is Driver, create a driver record
        if (role === 'Driver' && data.user) {
            await supabase.from('drivers').insert([{
                name: full_name,
                phone: email,
                user_id: data.user.id
            }]);
        }

        res.json({ message: 'User successfully onboarded.', user: data.user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/profile', authenticateToken, async (req, res) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', req.user.id).single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`FleetSight Logic Engine listening on port ${PORT}`));
