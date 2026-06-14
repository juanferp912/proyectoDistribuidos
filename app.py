# app.py
import streamlit as st
import psycopg2
import pandas as pd
import os

st.set_page_config(page_title="La Bolonería - Dashboard", page_icon="📊", layout="wide")
st.title("📊 Sistema Analítico - La Bolonería")
st.markdown("---")

def conectar_db():
    return psycopg2.connect(
        host="postgres_boloneria",
        database=os.getenv("DB_NAME", "inventario_db"),
        user=os.getenv("DB_USER", "admin_boloneria"),
        password=os.getenv("DB_PASSWORD", "nosevendenbolonesdeatun1980")
    )

try:
    conn = conectar_db()
    
    # REPORTE 3: RESUMEN GERENCIAL
    query_resumen = """
    SELECT 
        (SELECT COUNT(*) FROM materia_prima) AS total_skus,
        (SELECT SUM(stock_actual * costo_unitario) FROM materia_prima) AS valor_total_bodega,
        (SELECT COUNT(*) FROM productos_menu) AS total_platos_menu;
    """
    df_resumen = pd.read_sql(query_resumen, conn)
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric(label="Total de SKUs en Bodega", value=int(df_resumen['total_skus'].iloc[0]))
    with col2:
        st.metric(label="Valorización Total de Bodega", value=f"${df_resumen['valor_total_bodega'].iloc[0]:,.2f}")
    with col3:
        st.metric(label="Platos Activos en el Menú", value=int(df_resumen['total_platos_menu'].iloc[0]))

    st.markdown("---")
    
    col_izq, col_der = st.columns(2)
    
    with col_izq:
        # REPORTE 1: ALERTA INTELIGENTE (Consultas simplificadas)
        st.subheader("🚨 Alerta de Reorden de Stock")
        query_stock = """
        SELECT nombre_insumo as "Insumo", stock_actual as "Stock Actual", punto_reorden as "Mínimo", proveedor as "Proveedor" 
        FROM materia_prima 
        WHERE stock_actual <= punto_reorden;
        """
        df_stock = pd.read_sql(query_stock, conn)
        if not df_stock.empty:
            st.dataframe(df_stock, use_container_width=True)
        else:
            st.success("✅ Todos los insumos tienen stock saludable.")
            
    with col_der:
        # REPORTE 2: ANÁLISIS FINANCIERO
        st.subheader("💰 Top 5 Insumos - Mayor Capital Inmovilizado")
        query_finanzas = """
        SELECT nombre_insumo, (stock_actual * costo_unitario) as capital_invertido 
        FROM materia_prima 
        ORDER BY capital_invertido DESC 
        LIMIT 5;
        """
        df_finanzas = pd.read_sql(query_finanzas, conn)
        st.bar_chart(data=df_finanzas, x="nombre_insumo", y="capital_invertido", use_container_width=True)

except Exception as e:
    st.error(f"Error al conectar con la base de datos: {e}")