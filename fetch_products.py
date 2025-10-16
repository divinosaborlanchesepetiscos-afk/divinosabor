from supabase import create_client, Client
import os
import json

supabase_url = 'https://itfabqajajixkyokgrlm.supabase.co'
supabase_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZmFicWFqYWppeGt5b2tncmxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTcwMTgyOCwiZXhwIjoyMDc1Mjc3ODI4fQ.GSorcdMI5X6NFwFHYuZY7UhhTqN3rvb7FzuKkK21bhc' # Using service_role key for fetching products

supabase: Client = create_client(supabase_url, supabase_key)

def fetch_products():
    try:
        # Adicionado count='exact' para forçar a atualização do cache
        response = supabase.table('products').select('*, image', count='exact').execute()
        products = response.data
        if products:
            with open('products.json', 'w', encoding='utf-8') as f:
                json.dump(products, f, ensure_ascii=False, indent=4)
            print(f"Produtos salvos em products.json: {len(products)} itens.")
        else:
            print("Nenhum produto encontrado.")
    except Exception as e:
        print(f"Erro ao buscar produtos: {e}")

if __name__ == '__main__':
    fetch_products()

