FleetSight  

Real-Time Fleet Intelligence, Delivered 

 

1. Product Vision 

 An AI-native logistics visibility platform that replaces spreadsheets and phone-call-based coordination with a centralized, real-time operational command center for fleet and delivery management. 

Shape 

2. USP (Unique Selling Proposition) 

🚀 “AI-Powered Predictive Visibility — Not Just Tracking” 

Unlike traditional fleet dashboards that show current status only, this platform: 

Predicts delays before they happen 

Auto-detects idle inefficiencies 

Recommends route optimizations 

Provides smart operational alerts 

Uses AI-native event detection instead of passive monitoring 

This transforms the tool from a “monitoring system” into an Operations Intelligence Engine. 

Shape 

3. Target Users 

Logistics Managers 

Fleet Supervisors 

Dispatch Coordinators 

Operations Heads 

Shape 

4. MVP Scope (Demo-Level but Intelligent) 

Web-based application with: 

Fleet Management 

Delivery Management 

Route Visualization (Map) 

Driver Assignment 

Operations Dashboard 

AI-based Delay & Idle Detection Engine 

Shape 

5. High-Level Architecture (Web-Based Only) 

Frontend 

React (AI-assisted UI generation) + Tailwind CSS

Real-time updates via WebSockets 

Map integration (Google Maps / Mapbox) 

Backend 

Express.js

Event-driven architecture 

AI microservice for prediction 

Database 

Supabase

6. Functional Modules & End-to-End Flows 

Shape 

🚛 6.1 Fleet Module 

Features 

Register vehicles 

Assign drivers 

Track vehicle status: 

Active 

Idle 

Under Maintenance 

Shape 

🔄 Fleet Registration Flow 

User → Fleet → “Add Vehicle” 

Enter: 

Vehicle ID 

Type 

Capacity 

Registration Number 

Assign Driver (optional) 

Save 

System: 

Creates vehicle record 

Sets status = Idle 

Logs activity 

 

🔄 Driver Assignment Flow 

User → Fleet → Select Vehicle 

Click “Assign Driver” 

Select driver 

Confirm 

System: 

Updates vehicle-driver mapping 

Sends notification to driver 

Logs timestamp 

 

🔄 Vehicle Status Engine Logic 

Status auto-updates based on: 

GPS movement 

Assigned delivery 

Maintenance flag 

Rules: 

No movement for 30 mins → Idle 

Assigned + moving → Active 

Maintenance flag → Under Maintenance 

 

📦 6.2 Delivery Module 

Features 

Create delivery orders 

Assign to vehicle 

Track delivery status: 

Pending 

In Transit 

Delivered 

Delayed 

Route visualization 

 

🔄 Delivery Creation Flow 

User → Deliveries → “Create Delivery” 

Enter: 

Pickup location 

Drop location 

Customer name 

Expected delivery time 

Save 

System: 

Status = Pending 

AI calculates estimated route 

Stores baseline ETA 

 

🔄 Delivery Assignment Flow 

Select delivery 

Click “Assign Vehicle” 

Choose vehicle 

Confirm 

System: 

Status → In Transit 

Vehicle status → Active 

Route generated 

Driver notified 

 

🔄 Delivery Tracking Flow 

System continuously evaluates: 

Current GPS vs planned route 

Current ETA vs expected ETA 

AI evaluates: 

Traffic 

Speed patterns 

Route deviation 

Status Logic: 

If ETA > threshold → Delayed 

If arrived → Delivered 

 

🗺 6.3 Map Module 

Features 

Display live vehicle locations 

Show active routes 

Highlight delayed shipments 

 

🔄 Map Rendering Flow 

On dashboard load: 

Fetch active vehicles 

Fetch active deliveries 

Render: 

Green → On-time 

Yellow → At risk 

Red → Delayed 

Click vehicle: 

Show driver details 

Show delivery assigned 

Show ETA 

Click delivery: 

Show route 

Show predicted delay risk % 

 

📊 6.4 Dashboard Module (Operations Command Center) 

Widgets 

Active Deliveries Count 

Idle Vehicles List 

Delayed Shipments Indicator 

Driver-wise Delivery Summary 

AI Risk Alerts Panel 

 

🔄 Dashboard Data Flow 

Every 30 seconds: 

Fetch real-time metrics 

Run AI checks 

Update alert flags 

 

📌 Dashboard KPI Definitions 

KPI 

Logic 

Active Deliveries 

Status = In Transit 

Idle Vehicles 

No movement > 30 mins 

Delayed Shipments 

ETA breach > threshold 

Driver Summary 

Completed vs Assigned 

 

7. AI-Native Capabilities (USP Layer) 

 

🧠 7.1 Predictive Delay Engine 

Input: 

Current speed 

Historical traffic data 

Route congestion patterns 

Weather APIs 

Output: 

Delay probability % 

Risk category: 

Low 

Medium 

High 

Displayed as: 
“Delivery #123 has 72% risk of delay.” 

 

🧠 7.2 Idle Vehicle Intelligence 

Instead of static “Idle”: 

System evaluates: 

Is this idle expected? 

Is there pending delivery nearby? 

Could reassignment improve SLA? 

Suggest: 
“Vehicle V12 idle for 45 mins. Recommend assigning Delivery #342 (3km away).” 

 

🧠 7.3 Route Deviation Detection 

If vehicle deviates > X meters: 

Alert ops team 

Show deviation highlight on map 

 

8. End-to-End User Journey 

 

🎯 Scenario: Delivery Lifecycle 

Ops creates delivery 

AI calculates optimal route 

Assign vehicle 

Vehicle starts trip 

Live tracking updates 

AI flags delay risk 

Dashboard alert appears 

Ops takes action: 

Notify customer 

Reassign vehicle 

Delivery marked complete 

Performance recorded 

 

9. Non-Functional Requirements 

Real-time updates < 5 sec latency 

Scalable to 10,000 vehicles 

Secure role-based access 

99% uptime 

Cloud-native deployment 

 

10. MVP Metrics for Success 

Reduction in manual calls by 60% 

Reduction in delay incidents by 25% 

Increase fleet utilization by 15% 

Dashboard adoption rate > 80% 

 

11. Future Roadmap (Post-MVP) 

AI-based auto dispatching 

Fuel efficiency optimization 

Driver performance scoring 

Predictive maintenance 

Customer tracking portal 

Mobile app for drivers 

 

12. Wireframe-Level Page Structure 

Login Page 

Dashboard 

Fleet Management 

Delivery Management 

Map View 

Reports 

Settings 

 

13. Differentiation vs Traditional Fleet Tools 

Traditional 

This Platform 

Reactive 

Predictive 

Status view 

Intelligence engine 

Manual coordination 

AI suggestions 

Spreadsheet heavy 

Real-time decision system 

 

14. Why This MVP Is Powerful 

Even at demo level, it demonstrates: 

Real-time tracking 

AI delay prediction 

Smart idle detection 

Route intelligence 

Operational command center 

This positions the product as: 

“The AI Control Tower for Logistics Operations.” 

 