import { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, IconButton, DataTable, Card, Divider, Avatar, Chip } from "react-native-paper";
import {green} from "../../../../constants/Colors"

const COLORS = {
  primary: "#3f51b5",
  primaryLight: "#e8eaf6",
  secondary: "#ff6e40",
  text: "#263238",
  textLight: "#78909c",
  border: "#e1e2e6",
  background: "#f5f7fa",
  white: "#ffffff",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
};

const RoomChecklistForm = ({ navigation, route }) => {
  const { checklist_form } = route.params;
  const [showDeclineRequest, setShowDeclineRequest] = useState(false);

  const handleRoomAllocation = () => {
    //room allocation logic
  };

  const showDeclineModal = () => {
    setShowDeclineRequest(true);
  };

  const hideDeclineModal = () => {
    setShowDeclineRequest(false);
  };

  // Helper function to format item keys nicely
  const formatItemName = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Get condition status color
  const getConditionColor = (condition) => {
    if (!condition || condition === "N/A") return COLORS.textLight;
    condition = condition.toLowerCase();
    if (condition.includes("good") || condition.includes("excellent")) 
      return COLORS.success;
    if (condition.includes("fair") || condition.includes("average")) 
      return COLORS.warning;
    if (condition.includes("poor") || condition.includes("bad")) 
      return COLORS.error;
    return COLORS.textLight;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text style={styles.formTitle}>Room Checklist Form</Text>
            <Divider style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Date Assigned</Text>
                <Text style={styles.infoValue}>{checklist_form.createdAt.split('T')[0]}</Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Batch</Text>
                <Text style={styles.infoValue}>
                  {checklist_form.faculty} | {checklist_form.batch}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title 
            title="Member Details" 
            titleStyle={styles.sectionTitle}
            left={(props) => <Avatar.Icon {...props} icon="account-group" color={COLORS.white} style={{backgroundColor: green}} />}
          />
          <Card.Content>
            {checklist_form.members.map((member, index) => (
              <View key={index} style={styles.memberRow}>
                <View style={styles.memberInfo}>
                  <Avatar.Text 
                    size={36} 
                    label={member.substring(0, 2).toUpperCase()} 
                    color={COLORS.white}
                    style={{backgroundColor: green}}
                  />
                  <Text style={styles.memberName}>{member}</Text>
                </View>
                <IconButton
                  icon="account-search"
                  iconColor={green}
                  size={24}
                  onPress={() => {/* View member details */}}
                />
              </View>
            ))}
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title 
            title="Reason for Request" 
            titleStyle={styles.sectionTitle}
            left={(props) => <Avatar.Icon {...props} icon="clipboard-text" color={COLORS.white} style={{backgroundColor: green}} />}
          />
          <Card.Content>
            <Text style={styles.reasonText}>{checklist_form.reason}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title 
            title="Room Furniture Details" 
            titleStyle={styles.sectionTitle}
            left={(props) => <Avatar.Icon {...props} icon="table-furniture" color={COLORS.white} style={{backgroundColor:green}} />}
          />
          <Card.Content>
            <DataTable style={styles.furnitureTable}>
              <DataTable.Header style={styles.tableHeader}>
                <DataTable.Title style={{flex: 0.5}} textStyle={styles.columnHeader}>No</DataTable.Title>
                <DataTable.Title style={{flex: 3}} textStyle={styles.columnHeader}>Item</DataTable.Title>
                <DataTable.Title style={{flex: 2}} textStyle={styles.columnHeader}>Condition</DataTable.Title>
                <DataTable.Title style={{flex: 0.5}} textStyle={styles.columnHeader}>Qty</DataTable.Title>
              </DataTable.Header>

              {checklist_form.furnitureDetails &&
                Object.keys(checklist_form.furnitureDetails)
                  .filter((key) => key.endsWith("_condition"))
                  .map((conditionKey, index) => {
                    const itemKey = conditionKey.replace("_condition", "");
                    let condition = checklist_form.furnitureDetails[conditionKey] || "N/A";
                    let quantity = checklist_form.furnitureDetails[`${itemKey}_quantity`] || "N/A";
                    const itemName = formatItemName(itemKey);
                    const conditionColor = getConditionColor(condition);

                    return (
                      <DataTable.Row key={index} style={styles.tableRow}>
                        <DataTable.Cell style={{flex: 0.5}} textStyle={styles.tableCell}>
                          {index + 1}
                        </DataTable.Cell>
                        <DataTable.Cell style={{flex: 3}} textStyle={styles.tableCell}>
                          {itemName}
                        </DataTable.Cell>
                        <DataTable.Cell style={{flex: 2}} textStyle={styles.tableCell}>
                          <Chip 
                            textStyle={{color: COLORS.white}} 
                            style={{backgroundColor: conditionColor, height: 28}}
                          >
                            {condition}
                          </Chip>
                        </DataTable.Cell>
                        <DataTable.Cell style={{flex: 0.5}} textStyle={styles.tableCell}>
                          {quantity}
                        </DataTable.Cell>
                      </DataTable.Row>
                    );
                  })}
            </DataTable>
          </Card.Content>
        </Card>

        <Card style={styles.sectionCard}>
          <Card.Title 
            title="Item Condition Details" 
            titleStyle={styles.sectionTitle}
            left={(props) => <Avatar.Icon {...props} icon="text-box" color={COLORS.white} style={{backgroundColor: green}} />}
          />
          <Card.Content>
            <Text style={styles.conditionDetailsText}>
              {checklist_form.furnitureDetails?.comments || "No additional comments provided."}
            </Text>
          </Card.Content>
        </Card>

        <View style={styles.actionButtonContainer}>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  formTitle: {
    fontFamily: "fontBold",
    fontSize: 22,
    color: green,
    textAlign: "center",
    marginBottom: 12,
  },
  divider: {
    height: 1.5,
    backgroundColor: COLORS.primaryLight,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  infoItem: {
    marginBottom: 8,
    width: "48%",
  },
  infoLabel: {
    fontFamily: "fontMedium",
    fontSize: 14,
    color: COLORS.textLight,
  },
  infoValue: {
    fontFamily: "fontRegular",
    fontSize: 16,
    color: COLORS.text,
    marginTop: 4,
  },
  sectionCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  sectionTitle: {
    fontFamily: "fontBold",
    fontSize: 18,
    color: COLORS.text,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberName: {
    fontFamily: "fontRegular",
    fontSize: 16,
    marginLeft: 12,
    color: COLORS.text,
  },
  reasonText: {
    fontFamily: "fontRegular",
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  furnitureTable: {
    marginTop: 8,
  },
  tableHeader: {
    backgroundColor: COLORS.primaryLight,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  columnHeader: {
    fontFamily: "fontMedium",
    fontSize: 14,
    color: green,
  },
  tableRow: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableCell: {
    fontFamily: "fontRegular",
    fontSize: 14,
    color: COLORS.text,
  },
  conditionDetailsText: {
    fontFamily: "fontRegular",
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
  },
  actionButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 24,
  },
  declineButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 12,
    borderColor: COLORS.error,
    borderWidth: 2,
    paddingVertical: 4,
  },
  declineButtonLabel: {
    fontFamily: "fontMedium",
    fontSize: 16,
    color: COLORS.error,
  },
  acceptButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: green,
    paddingVertical: 4,
  },
  acceptButtonLabel: {
    fontFamily: "fontMedium",
    fontSize: 16,
    color: COLORS.white,
  },
});

export default RoomChecklistForm;