# app.py
import streamlit as st
import psycopg2
import pandas as pd
import os

# Configuración de la página
st.set_page_config(page_title="La Bolonería - Dashboard", page_icon="📊", layout="wide")
st.title("📊 Sistema Analítico - La Bolonería")
st.markdown("---")

# Conexión a la Base de Datos usando las variables de entorno de Docker
def conectar_db():
    return psycopg2.connect(
        host="postgres_boloneria",
        database=os.getenv("DB_NAME", "inventario_db"),
        user=os.getenv("DB_USER", "admin_boloneria"),
        password=os.getenv("DB_PASSWORD", "nosevendenbolonesdeatun1980")
    )

try:
    conn = conectar_db()
    
    # ---------------------------------------------------------
    # REPORTE 3: RESUMEN GERENCIAL (Métricas principales)
    # ---------------------------------------------------------
    query_resumen = """
    SELECT 
        COUNT(*) as total_skus, 
        SUM(cantidad_stock * precio_unitario) as valor_total_bodega,
        COUNT(CASE WHEN fecha_caducidad <= CURRENT_DATE + INTERVAL '3 days' THEN 1 END) as productos_por_caducar
    FROM materia_prima;
    """
    df_resumen = pd.read_sql(query_resumen, conn)
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric(label="Total de SKUs en Bodega", value=int(df_resumen['total_skus'].iloc[0]))
    with col2:
        st.metric(label="Valorización Total de Bodega", value=f"${df_resumen['valor_total_bodega'].iloc[0]:,.2f}")
    with col3:
        por_caducar = int(df_resumen['productos_por_caducar'].iloc[0])
        if por_caducar > 0:
            st.metric(label="🚨 Alerta: Productos por Caducar (3 días)", value=por_caducar, delta="- Riesgo Merma", delta_color="inverse")
        else:
            st.metric(label="Productos por Caducar (3 días)", value=por_caducar)

    st.markdown("---")
    
    # Secciones en paralelo (Izquierda: Alertas de Stock | Derecha: Top Inversión)
    col_izq, col_der = st.columns(2)
    
    with col_izq:
        # ---------------------------------------------------------
        # REPORTE 1: ALERTA INTELIGENTE DE BAJO STOCK
        # ---------------------------------------------------------
        st.subheader("🚨 Alerta de Reorden de Stock")
        query_stock = """
        SELECT nombre_insumo as "Insumo", cantidad_stock as "Stock Actual", punto_reorden as "Mínimo", proveedor_ref as "Proveedor" 
        FROM materia_prima 
        WHERE cantidad_stock <= punto_reorden;
        """
        df_stock = pd.read_sql(query_stock, conn)
        if not df_stock.empty:
            st.dataframe(df_stock, use_container_width=True)
        else:
            st.success("✅ Todos los insumos tienen stock saludable.")
            
    with col_der:
        # ---------------------------------------------------------
        # REPORTE 2: ANÁLISIS FINANCIERO (TOP 5)
        # ---------------------------------------------------------
        st.subheader("💰 Top 5 Insumos - Mayor Capital Inmovilizado")
        query_finanzas = """
        SELECT nombre_insumo, (cantidad_stock * precio_unitario) as capital_invertido 
        FROM materia_prima 
        ORDER BY capital_invertido DESC 
        LIMIT 5;
        """
        df_finanzas = pd.read_sql(query_finanzas, conn)
        st.bar_chart(data=df_finanzas, x="nombre_insumo", y="capital_invertido", use_container_width=True)

except Exception as e:
    st.error(f"Error al conectar con la base de datos: {e}")