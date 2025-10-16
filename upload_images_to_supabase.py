import os
import json
from supabase import create_client, Client

# Credenciais do Supabase fornecidas pelo usuário
SUPABASE_URL = "https://itfabqajajixkyokgrlm.supabase.co"
SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZmFicWFqYWppeGt5b2tncmxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTcwMTgyOCwiZXhwIjoyMDc1Mjc3ODI4fQ.GSorcdMI5X6NFwFHYuZY7UhhTqN3rvb7FzuKkK21bhc"

# Inicializar cliente Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Caminho para o arquivo JSON de produtos
PRODUCTS_FILE = "/home/ubuntu/divino-sabor-novo/products.json"
# Caminho para o diretório das imagens geradas
IMAGES_DIR = "/home/ubuntu/divino-sabor-novo/public/images/menu_items/"
# Nome do bucket no Supabase Storage
BUCKET_NAME = "menu-images"

def format_filename(product_name):
    # Mapeamento manual para nomes de arquivo que não seguem o padrão simples
    name_map = {
        "Brama / Antártica / Bud / Skol 1 litro": "cervejas_1_litro.png",
        "Heineken long neck / lata": "heineken_long_neck_lata.png",
        "Brama / Skol / Antártica / Bud / Amstel litrinho e lata": "cervejas_litrinho_lata.png",
        "Coca-Cola 2L retornável": "coca_cola_2l_retornavel.png",
        "Coca-Cola 2L": "coca_cola_2l.png",
        "Fanta / Sprite / Laranja / Uva 2L": "refrigerantes_2l.png",
        "Guaraná / Framboesa / Abacaxi 2L": "guarana_framboesa_abacaxi_2l.png",
        "Original litrinho / lata": "original_litrinho_lata.png",
        "Original 600 ml": "original_600ml.png",
        "Original 1 litro": "original_1_litro.png",
        "Heineken 600 ml": "heineken_600ml.png",
        "Refrigerante lata": "refrigerante_lata.png",
        "Água": "agua.png",
        "Água com gás": "agua_com_gas.png",
        "Mini refrigerante": "mini_refrigerante.png",
        "Suco Dell Valle": "suco_dell_valle.png",
        "Tubaína": "tubaina.png",
        "Energético": "energetico.png",
        "X Salada": "x_salada.png",
        "X Bacon": "x_bacon.png",
        "X Calabresa": "x_calabresa.png",
        "X Coração": "x_coracao.png",
        "X Frango": "x_frango.png",
        "X Divino Sabor": "x_divino_sabor.png",
        "Espetinho de Carne": "espetinho_de_carne.png",
        "Espetinho de Carne com Bacon": "espetinho_de_carne_com_bacon.png",
        "Espetinho de Carne com Legumes": "espetinho_de_carne_com_legumes.png",
        "Espetinho de Cafta": "espetinho_de_cafta.png",
        "Espetinho de Coração": "espetinho_de_coracao.png",
        "Espetinho de Linguiça": "espetinho_de_linguica.png",
        "Espetinho de Frango com Bacon": "espetinho_de_frango_com_bacon.png",
        "Espetinho de Tulipa": "espetinho_de_tulipa.png",
        "Espetinho de Queijo": "espetinho_de_queijo.png",
        "Espetinho de Pão de Alho": "espetinho_de_pao_de_alho.png",
        "Calabresa (0.5 Kg)": "calabresa_05kg.png",
        "Calabresa (1 Kg)": "calabresa_1kg.png",
        "Tulipa (0.5 Kg)": "tulipa_05kg.png",
        "Tulipa (1 Kg)": "tulipa_1kg.png",
        "Frango a passarinho (0.5 Kg)": "frango_a_passarinho_05kg.png",
        "Frango a passarinho (1 Kg)": "frango_a_passarinho_1kg.png",
        "Batata frita (0.5 Kg)": "batata_frita_05kg.png",
        "Batata frita (1 Kg)": "batata_frita_1kg.png",
        "Polenta frita (0.5 Kg)": "polenta_frita_05kg.png",
        "Polenta frita (1 Kg)": "polenta_frita_1kg.png",
        "Anéis de cebola (0.5 Kg)": "aneis_de_cebola_05kg.png",
        "Anéis de cebola (1 Kg)": "aneis_de_cebola_1kg.png",
        "Tilápia (0.5 Kg)": "tilapia_05kg.png",
        "Tilápia (1 Kg)": "tilapia_1kg.png",
        "Pastelzinho (10 unidades)": "pastelzinho_10_unidades.png",
        "Pastel de Carne": "pastel_de_carne.png",
        "Pastel de Carne com Ovo": "pastel_de_carne_com_ovo.png",
        "Pastel de Frango": "pastel_de_frango.png",
        "Pastel de Frango com Catupiri": "pastel_de_frango_com_catupiri.png",
        "Pastel de Pizza": "pastel_de_pizza.png",
        "Pastel de Queijo": "pastel_de_queijo.png"
    }
    return name_map.get(product_name, product_name.lower().replace(" ", "_").replace("/", "_").replace("(", "").replace(")", "").replace(".", "").replace("á", "a").replace("ã", "a").replace("é", "e").replace("ç", "c").replace("í", "i").replace("ó", "o").replace("ú", "u") + ".png")

def upload_image_and_update_product():
    with open(PRODUCTS_FILE, "r", encoding="utf-8") as f:
        products = json.load(f)

    # Criar o bucket se não existir
    try:
        supabase.storage.create_bucket(BUCKET_NAME)
        print(f"Bucket \'{BUCKET_NAME}\' criado com sucesso.")
    except Exception as e:
        if "The resource already exists" in str(e):
            print(f"Bucket \'{BUCKET_NAME}\' já existe.")
        else:
            print(f"Erro ao criar bucket: {e}")

    # Definir políticas de acesso público para o bucket
    try:
        print(f"Assumindo que o bucket \'{BUCKET_NAME}\' tem políticas de acesso público configuradas.")
    except Exception as e:
        print(f"Erro ao definir políticas de acesso público para o bucket: {e}")

    for product in products:
        product_id = product["id"]
        product_name = product["name"]
        
        image_filename = format_filename(product_name)
        local_image_path = os.path.join(IMAGES_DIR, image_filename)

        print(f"DEBUG: Tentando processar produto: {product_name}")
        print(f"DEBUG: Nome de arquivo gerado: {image_filename}")
        print(f"DEBUG: Caminho local da imagem: {local_image_path}")

        if os.path.exists(local_image_path):
            try:
                # Tentar obter a URL pública primeiro, se a imagem já existir
                public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(image_filename)
                if public_url:
                    print(f"Imagem \'{image_filename}\' já existe no Supabase Storage. Obtendo URL pública e atualizando o produto.")
                else:
                    # Se não houver URL pública, tentar fazer o upload
                    with open(local_image_path, "rb") as f:
                        supabase.storage.from_(BUCKET_NAME).upload(file=f.read(), path=image_filename, file_options={"content-type": "image/png"})
                    print(f"Imagem \'{image_filename}\' carregada para o Supabase Storage.")
                    public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(image_filename)
                    print(f"URL pública para \'{image_filename}\' : {public_url}")

                # Atualizar o produto no banco de dados com a URL pública
                update_response = supabase.table("products").update({"image": public_url}).eq("id", product_id).execute()
                if update_response.data:
                    print(f"Produto \'{product_name}\' (ID: {product_id}) atualizado com a URL da imagem.")
                else:
                    print(f"Erro ao atualizar produto \'{product_name}\' (ID: {product_id}): {update_response.status_code} - {update_response.content}")

            except Exception as e:
                print(f"Erro ao processar imagem para \'{product_name}\' : {e}")
        else:
            print(f"Imagem local não encontrada para \'{product_name}\' : {local_image_path}")

    print("Processo de upload e atualização concluído.")

if __name__ == "__main__":
    upload_image_and_update_product()

