import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Switch, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'
import api from '../../../services/api'

interface OrphanageDataRouteParams {
  position: {
    latitude: number
    longitude: number
  }
}

interface FormValues {
  name: string;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: FileList
}

export default function OrphanageData() {
  const route = useRoute()
  const [formValues, setFormValues] = useState<FormValues>()
  const [images, setImages] = useState<string[]>([])
  const navigation = useNavigation()
  const params = route.params as OrphanageDataRouteParams

  function handleChange(name: string, value: string | boolean) {
    const newValue = {
    }
    setFormValues({
      ...formValues,
      [name]: value
    })
  }

  async function handleSelectImages() {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync()
    if (status !== 'granted') {
      alert('Precisamos de acesso às suas fotos')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true, // Permite ao usuário cortar/editar imagem
      quality: 1, // Qualidade da imagem (Vai de 0 a 1)
      mediaTypes: ImagePicker.MediaTypeOptions.Images // Aceitar somente imagens
    })

    if (result.cancelled) {
      return
    }

    const { uri: image } = result
    setImages([
      ...images,
      image
    ])
  }

  async function handleSubmit() {
    const { latitude, longitude } = params.position

    if (!formValues) {
      return
    }
  
    const formData = new FormData();
    formData.append('name', formValues.name);
    formData.append('about', formValues.about);
    formData.append('latitude', String(latitude));
    formData.append('longitude', String(longitude));
    formData.append('instructions', formValues.instructions);
    formData.append('opening_hours', formValues.opening_hours);
    formData.append('open_on_weekends', String(formValues.open_on_weekends));

    images.forEach((image, index) => {
      formData.append('images', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: image,
      } as any);
    });

    await api.post('orphanages', formData);

    alert('Cadastro realizado com sucesso!');

    navigation.navigate('OrphanagesMap');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.title}>Dados</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={formValues?.name}
        onChangeText={(text: string) => handleChange('name', text)}
      />

      <Text style={styles.label}>Sobre</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={formValues?.about}
        onChangeText={(text: string) => handleChange('about', text)}
      />

      {/* <Text style={styles.label}>Whatsapp</Text>
      <TextInput
        style={styles.input}
      /> */}

      <Text style={styles.label}>Fotos</Text>

      <View style={styles.uploadedImagesContainer}>
        {
          images.map(image => (
            <Image
              key={image}
              source={{uri: image}}
              style={styles.uploadedImage}
            />
          ))
        }
      </View>

      <TouchableOpacity style={styles.imagesInput} onPress={handleSelectImages}>
        <Feather name="plus" size={24} color="#15B6D6" />
      </TouchableOpacity>

      <Text style={styles.title}>Visitação</Text>

      <Text style={styles.label}>Instruções</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={formValues?.instructions}
        onChangeText={(text: string) => handleChange('instructions', text)}
      />

      <Text style={styles.label}>Horario de visitas</Text>
      <TextInput
        style={styles.input}
        value={formValues?.opening_hours}
        onChangeText={(text: string) => handleChange('opening_hours', text)}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Atende final de semana?</Text>
        <Switch 
          thumbColor="#fff" 
          trackColor={{ false: '#ccc', true: '#39CC83' }}
          value={formValues?.open_on_weekends}
          onValueChange={(value: boolean) => handleChange('open_on_weekends', value)}
        />
      </View>

      <RectButton style={styles.nextButton} onPress={handleSubmit}>
        <Text style={styles.nextButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    color: '#5c8599',
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: '#D3E2E6'
  },

  label: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 8,
  },

  comment: {
    fontSize: 11,
    color: '#8fa7b3',
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 20,
    height: 56,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 16,
    textAlignVertical: 'top',
  },

  imagesInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderStyle: 'dashed',
    borderColor: '#96D2F0',
    borderWidth: 1.4,
    borderRadius: 20,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },

  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
    marginTop: 32,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  },

  uploadedImagesContainer: {
    flexDirection: 'row'
  },

  uploadedImage: {
    width: 64,
    height: 64,
    borderRadius: 20,
    marginBottom: 32,
    marginRight: 8
  }
})