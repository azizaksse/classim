import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register a font that supports generic text. 
// For Arabic support, we would need a specific font registration, 
// but for now we'll stick to standard latin characters or provided font.
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#111',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa',
        padding: 10,
        borderRadius: 4,
    },
    statBox: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 10,
        color: '#666',
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        margin: 'auto',
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '20%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        backgroundColor: '#e4e4e4',
    },
    tableCol: {
        width: '20%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCellHeader: {
        margin: 5,
        fontSize: 10,
        fontWeight: 'bold',
    },
    tableCell: {
        margin: 5,
        fontSize: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        fontSize: 10,
        textAlign: 'center',
        color: '#aaa',
    },
});

interface Order {
    _id: string;
    _creationTime: number;
    customer_name: string;
    phone: string;
    city: string;
    wilaya_name?: string;
    product_name: string;
    quantity: number;
    delivery_price: number;
    status: string;
    created_at: string;
    delivery_place?: string;
    source?: string;
}

interface OrdersReportPDFProps {
    orders: any[]; // Using any to avoid strict type mismatch with backend return for now, can refine later
    stats: {
        totalRevenue: number;
        totalOrders: number;
        averageOrderValue: number;
    }
    dateRange: string;
}

const OrdersReportPDF: React.FC<OrdersReportPDFProps> = ({ orders, stats, dateRange }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>Orders Report</Text>
                <Text style={styles.subtitle}>{dateRange}</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Total Orders</Text>
                    <Text style={styles.statValue}>{stats.totalOrders}</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Verified Revenue (Est)</Text>
                    <Text style={styles.statValue}>{stats.totalRevenue.toLocaleString()} DA</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Average Order Value</Text>
                    <Text style={styles.statValue}>{Math.round(stats.averageOrderValue).toLocaleString()} DA</Text>
                </View>
            </View>

            <View style={styles.table}>
                <View style={styles.tableRow}>
                    <View style={{ ...styles.tableColHeader, width: '25%' }}>
                        <Text style={styles.tableCellHeader}>Customer</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '25%' }}>
                        <Text style={styles.tableCellHeader}>Product</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '15%' }}>
                        <Text style={styles.tableCellHeader}>Phone</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '15%' }}>
                        <Text style={styles.tableCellHeader}>Date</Text>
                    </View>
                    <View style={{ ...styles.tableColHeader, width: '20%' }}>
                        <Text style={styles.tableCellHeader}>Status</Text>
                    </View>
                </View>

                {orders.map((order) => (
                    <View style={styles.tableRow} key={order._id}>
                        <View style={{ ...styles.tableCol, width: '25%' }}>
                            <Text style={styles.tableCell}>{order.customer_name}</Text>
                            <Text style={{ ...styles.tableCell, fontSize: 8, color: '#666' }}>{order.city}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '25%' }}>
                            <Text style={styles.tableCell}>{order.product_name}</Text>
                            <Text style={{ ...styles.tableCell, fontSize: 8, color: '#666' }}>Qty: {order.quantity}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '15%' }}>
                            <Text style={styles.tableCell}>{order.phone}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '15%' }}>
                            <Text style={styles.tableCell}>{new Date(order._creationTime).toLocaleDateString()}</Text>
                        </View>
                        <View style={{ ...styles.tableCol, width: '20%' }}>
                            <Text style={styles.tableCell}>{order.status}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.footer}>
                <Text>Generated on {new Date().toLocaleString()} | Classimo Smart Fit</Text>
            </View>
        </Page>
    </Document>
);

export default OrdersReportPDF;
